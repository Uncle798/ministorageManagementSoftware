
import { validateSessionToken } from "$lib/server/authUtils";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
   const token = event.cookies.get('session') ?? null;
   console.log(token)
   if(!token){
      event.locals.user = null;
      event.locals.session = null;
      return await resolve(event, {
         transformPageChunk: ({html}) => {
            return html.replace('data-theme=""', `data-theme="hamlindigo"`)
         }
      });
   }
   const { session, user } = await validateSessionToken(token);
   if(session){
      event.cookies.set('session', token, {
         httpOnly: true,
         path: '/',
         secure: import.meta.env.PROD,
         sameSite: 'lax',
         expires: session.expiresAt
      })
   } else {      
      event.cookies.set('session', '', {
         httpOnly: true,
         path: '/',
         secure: import.meta.env.PROD,
         sameSite: 'lax',
         maxAge: 0,
      })
   }
   event.locals.session = session;
   event.locals.user = user;
   const theme = event.cookies.get('theme')
   if(!theme){
      return await resolve(event, {
         transformPageChunk: ({html}) => {
            return html.replace('data-theme=""', `data-theme="seafoam"`)
         }
      })
   }
   return await resolve(event, {
      transformPageChunk: ({html}) => {
         return html.replace('data-theme=""', `data-theme="${theme}"`)
      }
   })
}
