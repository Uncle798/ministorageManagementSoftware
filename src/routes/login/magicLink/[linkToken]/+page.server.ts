import { createSession, generateSessionToken, setSessionTokenCookie, verifyMagicLink } from '$lib/server/authUtils';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
   const linkToken = event.params.linkToken;
   const result = await verifyMagicLink(linkToken);
   if(result === 'not found'){
      return fail(404, {message:'token not found'})
   }
   if(result === 'expired'){
      redirect(302, '/login?toast=linkExpired');
   }
   const user = await prisma.user.update({
      where:{
         email: result
      },
      data: {
         emailVerified: true
      }
   })
   if(!user){
      return fail(500)
   }
   const token =  generateSessionToken();
   const session = await createSession(token, user.id!);
   setSessionTokenCookie(event, token, session.expiresAt);
   const redirectTo = event.url.searchParams.get('redirectTo');
   const unitNum = event.url.searchParams.get('unitNum');
   const invoiceNum = event.url.searchParams.get('invoiceNum');
   const paymentRecordNum = event.url.searchParams.get('paymentRecordNum');
   switch (redirectTo) {
      case 'home':
         redirect(303, '/');
      case 'newLease':
         redirect(302, `/newLease?unitNum=${unitNum}`);
      case 'units':
         if(unitNum){
            redirect(302, `/units/${unitNum}`);
         }
         redirect(302, '/units');
      case 'invoice':
         if(invoiceNum){
            redirect(302, `/invoices/${invoiceNum}`);
         }
         redirect(302, `/invoices`);
      case 'paymentRecord':
         if(paymentRecordNum){
            redirect(302, `/paymentRecords/${paymentRecordNum}`);
         }
         redirect(302, '/paymentRecords');
      default:
         redirect(302, '/');
   }
}) satisfies PageServerLoad;