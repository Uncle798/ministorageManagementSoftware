import { setDemoSessionTokenCookie } from '$lib/server/authUtils';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import dayjs from 'dayjs';

export const GET: RequestHandler = async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized')
   }
   const body = await event.request.json();
   const {token, domain} = body;
   if(!token){
      return new Response(JSON.stringify('Token not provided'), {status:400});
   }
   setDemoSessionTokenCookie(event, token, dayjs().add(1, 'month').toDate(), domain)
   console.log(event.cookies)
   return new Response(null, {status: 200});
};