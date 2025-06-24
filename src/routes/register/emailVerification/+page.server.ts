import { fail as superFormFail, superValidate, message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { emailVerificationFormSchema } from '$lib/formSchemas/schemas';
import { fail, redirect, } from '@sveltejs/kit';
import { ratelimit } from '$lib/server/rateLimit';
import { generateEmailVerificationRequest } from '$lib/server/authUtils';
import { sendVerificationEmail } from '$lib/server/mailtrap';
import { prisma } from '$lib/server/prisma';

export const load:PageServerLoad = (async (event) => {
    if(!event.locals.user){
        fail(401);
        return{};
    }
    if(event.locals.user.emailVerified){
        redirect(302, '/accountSettings')
    }
    const emailVerificationForm = await superValidate(valibot(emailVerificationFormSchema));
    const verification = await prisma.verification.findFirst({
        where: {
            userId: event.locals.user?.id
        }
    });
    if(!verification || verification?.expiresAt.getTime() <= Date.now() ){
        const code = await generateEmailVerificationRequest(event.locals.user.id, event.locals.user.email!);
        sendVerificationEmail(code, event.locals.user.email!);
    }
    const redirectTo = event.url.searchParams.get('redirectTo');
    const unitNum = event.url.searchParams.get('unitNum')
    return { emailVerificationForm, redirectTo, unitNum };
})

export const actions: Actions ={
    verify: async(event) => {
        if(!event.locals.user){
            redirect(302, '/login')
        }
        if(event.locals.user.emailVerified){
            redirect(302, '/');
        }
        const formData = await event.request.formData();
        const emailVerificationForm = await superValidate(formData, valibot(emailVerificationFormSchema));
        if(!emailVerificationForm.valid){
            return superFormFail(400, emailVerificationForm);
        }
        const { success, reset } = await ratelimit.emailVerification.limit(event.locals.user?.id || event.getClientAddress());
        if(!success) {
            const timeRemaining = Math.floor((reset - Date.now()) / 1000);
            return message(emailVerificationForm, `Please wait ${timeRemaining} seconds before trying again`);
        }
        const verification = await prisma.verification.findFirst({
            where: {
                userId: event.locals.user.id
            }
        })
        if(!verification){
            return fail(401, {verify:'Not authenticated'})
        }
        if(verification?.expiresAt.getTime() <= Date.now() ){
            const code = await generateEmailVerificationRequest(event.locals.user.id, event.locals.user.email!);
            sendVerificationEmail(code, event.locals.user.email!)
            return message(emailVerificationForm, 'The code had expired, we\'ve sent a new code to the email address on file');
        }
        if(verification.code !== emailVerificationForm.data.code){
            message(emailVerificationForm, 'Code was invalid');
        }
        await prisma.verification.delete({
            where: {
                id: verification.id
            }
        })
        await prisma.user.update({
            where: {
                id: event.locals.user.id
            },
            data: {
                emailVerified: true
            }
        })
        const redirectTo = event.url.searchParams.get('redirectTo');
        const unitNum = event.url.searchParams.get('unitNum');
        if(redirectTo === 'home'){
            redirect(302, '/')
        }
        if(redirectTo){
            redirect(302, `/${redirectTo}?unitNum=${unitNum}`)
        }
        return message(emailVerificationForm, 'Email verified');
    },
    resend: async(event) =>{
        if(!event.locals.user){
            return fail(401, {
                resend: {
                    message: 'Not authenticated'
                }
            })
        }
        if(event.locals.user.emailVerified){
            redirect(302, '/users/' + event.locals.user.id)
        }
        const { success, reset } = await ratelimit.emailVerification.limit(event.locals.user.id);
        if(!success){
            const timeRemaining = Math.floor((reset - Date.now()) / 1000);
            return fail(429, {
                resend:{
                    message: `Please wait ${timeRemaining} seconds before trying again`
                }
            })
        }
        if(!event.locals.user.email){
            redirect(301, '/register')
        }
        const code = await generateEmailVerificationRequest(event.locals.user.id, event.locals.user.email);
        sendVerificationEmail(code, event.locals.user.email);
        const message = { message: 'Email sent'}
        return { message }
    }
}