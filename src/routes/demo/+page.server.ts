import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { neonClient } from '$lib/server/neon';
import { NEON_PROJECT_ID } from '$env/static/private';
import { EndpointType } from '@neondatabase/api-client';

export const load = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized')
   }
   let dbBranch = await prisma.databaseBranch.create({
      data: {
         userId: event.locals.user.id
      }
   })
   const branch = await neonClient.createProjectBranch(NEON_PROJECT_ID, {
      endpoints: [
         {
            type: EndpointType.ReadWrite,
            provisioner: 'k8s-neonvm',
            autoscaling_limit_max_cu: 0.25,
            autoscaling_limit_min_cu: 0.25,
         }
      ],
      branch: {
         parent_id: 'br-plain-feather-aabanb4l',
         name: dbBranch.id
      }
   })
   dbBranch = await prisma.databaseBranch.update({
      where: {
         id: dbBranch.id,
      },
      data: {
         neonId: branch.data.branch.id,
         url: branch.data.endpoints[0].host
      }
   })
   return {};
}) satisfies PageServerLoad;