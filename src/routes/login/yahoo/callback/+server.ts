
import type { OAuth2Tokens } from 'arctic';
import type { RequestHandler } from './$types';
import { yahooOauth } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';
import { ObjectParser } from '@pilcrowjs/object-parser';
import { prisma } from '$lib/server/prisma';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/authUtils';

export const GET: RequestHandler = async (event) => {
   const storedState = event.cookies.get('yahooOauthState') ?? null
   const code = event.url.searchParams.get('code');
   const state = event.url.searchParams.get('state');
   const redirectTo = event.cookies.get('redirectTo') ?? null;
   const unitNum = event.cookies.get('unitNum') ?? null;
   const invoiceNum = event.cookies.get('invoiceNum') ?? null
   let response = new Response(null, {status:302, headers:{Location:'/'}});
      if(redirectTo){
      switch (redirectTo) {
         case 'newLease':
            if(unitNum){
               response = new Response(null, {status:302, headers:{Location: `/newLease?unitNum=${unitNum}`}});
            }
            break;
         case 'invoice':
            if(invoiceNum){
               response = new Response(null, {status:302, headers:{Location: `/invoices/${invoiceNum}`}})
            }
         default:
            break;
      }
   }
   if(code === null || storedState === null || state === null){
      new Response(JSON.stringify('Please restart the process something is null'), {status: 400})
   }
   if(storedState !== state) {
      return new Response('Please restart the process state does not equal stored state', {status: 400});
   }
   let tokens:OAuth2Tokens = {} as OAuth2Tokens;
   try {
      tokens = await yahooOauth.validateAuthorizationCode(code!)
   } catch (error) {
      console.error(error)
   }
   const claims = decodeIdToken(tokens.idToken());
   const claimsParser = new ObjectParser(claims);
   const email = claimsParser.getString('email');
   const yahooId = claimsParser.getString('sub');
   const givenName = claimsParser.getString('given_name');
   const familyName = claimsParser.getString('family_name');
   const existingUser = await prisma.user.findUnique({
      where: {
         email
      }
   })
   if(existingUser){
      if(!existingUser.yahooId){
         await prisma.user.update({
            where: {
               email
            },
            data:{
               yahooId
            }
         })
      }
   const sessionToken = generateSessionToken();
   const session = await createSession(sessionToken, existingUser.id);
   setSessionTokenCookie(event, sessionToken,  session.expiresAt);
   return response
   }
   const user = await prisma.user.create({
      data: {
         email,
         yahooId,
         givenName,
         familyName,
         emailVerified: true
      }
   })
   const sessionToken = generateSessionToken();
   const session = await createSession(sessionToken, user.id);
   setSessionTokenCookie(event, sessionToken, session.expiresAt);

   return response
};