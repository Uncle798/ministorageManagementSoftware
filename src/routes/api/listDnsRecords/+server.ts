import { VERCEL_TEAM_ID } from '$env/static/private';
import { vercelClient } from '$lib/server/vercel';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
   const result = await vercelClient.dns.getRecords({
      domain: 'ministoragemanagementsoftware.com',
      teamId: VERCEL_TEAM_ID
   }) 
   console.log(result)
   return new Response(JSON.stringify(result), {status: 200});
};