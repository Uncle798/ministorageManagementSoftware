import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { vercelClient } from '$lib/server/vercel';

export const load = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized');
   }
   const dbDeployment = await prisma.databaseBranch.create({
      data: {
         userId:event.locals.user.id,
      }
   })
   try {
      const project = await vercelClient.projects.createProject({
         requestBody: {
            name: `mms-demo-${event.locals.user.familyName.toLowerCase()}-${event.locals.user.givenName.toLowerCase()}`,
            framework: 'sveltekit',
            gitRepository: {
               type: 'github',
               repo: 'mmsWebsiteSvelte5',
            }
         }
      })
      await prisma.vercelDeployment.update({
         where: {
            id: dbDeployment.id
         },
         data: {
            vercelId: project.id,
            name: project.name,
         }
      })
      console.log(project)
      return {project};
   } catch (error) {
      console.error(error instanceof Error ? `Error: ${error.message}` : String(error));
   }
}) satisfies PageServerLoad;