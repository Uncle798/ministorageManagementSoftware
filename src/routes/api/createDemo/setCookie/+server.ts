import { setDemoSessionTokenCookie } from '$lib/server/authUtils';
import type { RequestHandler } from './$types';
import dayjs from 'dayjs';

export const POST: RequestHandler = async (event) => {
   if(!event.locals.user){
      return new Response('Please log in first', {status: 400})
   }
   const body = await event.request.json();
   const {token} = body;
   if(!token){
      return new Response(JSON.stringify('Token not provided'), {status:400});
   }
   setDemoSessionTokenCookie(event, token, dayjs().add(1, 'month').toDate())
   console.log(event.cookies)
   return new Response(null, {status: 200});
};