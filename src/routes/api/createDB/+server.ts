import { NEON_PROJECT_ID } from '$env/static/private';
import { neonClient } from '$lib/server/neon';
import { prisma } from '$lib/server/prisma';
import { EndpointType } from '@neondatabase/api-client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { userId } = body;
   if(!userId){
      return new Response(JSON.stringify('User Id not provided'), {status: 400});
   }
   const dbBranch = await prisma.databaseBranch.create({
      data: {
         userId: String(userId),
      }
   });
   const branch = await neonClient.createProjectBranch(NEON_PROJECT_ID, {
      endpoints: [
         {
            type:  EndpointType.ReadWrite,
            provisioner: 'k8s-neonvm',
            autoscaling_limit_min_cu: 0.25,
            autoscaling_limit_max_cu: 2,
         }
      ],
      branch: {
         parent_id: 'br-plain-feather-aabanb4l',
         name: dbBranch.id
      }
   })
   await prisma.databaseBranch.update({
      where: {
         id: dbBranch.id
      },
      data: {
         neonId: branch.data.branch.id,
         url: branch.data.endpoints[0].host
      }
   })
   console.log(branch.data);
   return new Response(JSON.stringify(branch.data), {status:200});
};