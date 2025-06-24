import { generateState } from 'arctic';
import type { RequestHandler } from './$types';
import { yahooOauth } from '$lib/server/oauth';

export const GET: RequestHandler = async (event) => {
   const redirectTo = event.url.searchParams.get('redirectTo');
   const unitNum = event.url.searchParams.get('unitNum');
   const invoiceNum = event.url.searchParams.get('invoiceNum');
   const state = generateState();
   const url = yahooOauth.createAuthorizationURL(state, ['openid', 'profile', 'email']);
      if(redirectTo){
      event.cookies.set('redirectTo', redirectTo, {
         httpOnly: true,
         maxAge: 60 *10,
         secure: import.meta.env.PROD,
         path: '/',
         sameSite: 'lax'
      })
      if(unitNum){
         event.cookies.set('unitNum', unitNum, {
            httpOnly: true,
            maxAge: 60 *10,
            secure: import.meta.env.PROD,
            path: '/',
            sameSite: 'lax'
         })
      }
      if(invoiceNum){
         event.cookies.set('invoiceNum', invoiceNum, {
            httpOnly: true,
            maxAge: 60 *10,
            secure: import.meta.env.PROD,
            path: '/',
            sameSite: 'lax'
         })
      }
   }
   event.cookies.set('yahooOauthState', state, {
      httpOnly: true,
      maxAge: 60 *10,
      secure: import.meta.env.PROD,
      path: '/',
      sameSite: 'lax'
   })
   return new Response(null, {
      status: 302,
      headers: {
         Location: url.toString()
      }
   });
};