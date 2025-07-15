import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
   const cookie = event.cookies.get('demoSession')
   if(cookie){
      event.cookies.delete('demoSession', {path: '/'})
   }
   return new Response(null, {status: 200});
};