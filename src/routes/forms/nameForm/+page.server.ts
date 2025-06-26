import { fail, message, superValidate } from 'sveltekit-superforms';
import { ratelimit } from "$lib/server/rateLimit";
import type { PageServerLoad, Actions } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { nameFormSchema } from '$lib/formSchemas/schemas';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load:PageServerLoad = (async () => {
    const nameForm = await superValidate(valibot(nameFormSchema));
    return { nameForm};
})

export const actions: Actions = {
    default: async (event) =>{
        if(!event.locals.user?.id){
            redirect(302, '/login?toast=unauthorized')
        }
        const formData = await event.request.formData();
        const nameForm = await superValidate(formData, valibot(nameFormSchema));
        const { success, reset } = await ratelimit.customerForm.limit(event.locals.user?.id)
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(nameForm, `Please wait ${timeRemaining}s before trying again.`)
		}
        if(!nameForm.valid){
            fail(400, nameForm);
        }
        await prisma.user.update({
            where:{
                id: event.locals.user?.id
            },
            data:{
                givenName: nameForm.data.givenName,
                familyName: nameForm.data.familyName,
                organizationName: nameForm.data.organizationName
            }
        })
        return message(nameForm, 'Name updated successfully')
    }
};