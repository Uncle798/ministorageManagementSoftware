import { NEON_API_KEY, NEON_PROJECT_ID } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
   const headers = new Headers();
   headers.append('Accept', 'application/json');
   headers.append('Authorization', `Bearer ${NEON_API_KEY}`);
   headers.append('Content-Type', 'application/json')
   const neonResponse = await fetch(`https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
         branch:{
            
         }
      })
   });
   console.log(neonResponse)
   return new Response(null, {status:200});
};