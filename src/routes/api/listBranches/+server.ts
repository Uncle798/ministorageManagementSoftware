import { NEON_API_KEY, NEON_PROJECT_ID } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
   const headers = new Headers();
   headers.append('Accept', 'application/json');
   headers.append('Authorization', `Bearer ${NEON_API_KEY}`);
   headers.append('Content-Type', 'application/json')
   const neonRes = await fetch(`https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches`, {
      headers,
      method: 'GET'
   }).then(async (res) => {
      return await res.json();
   })
   console.log(neonRes)
   return new Response(JSON.stringify(neonRes), {status: 200});
};