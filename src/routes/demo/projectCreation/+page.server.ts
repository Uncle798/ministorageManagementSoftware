import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { vercelClient } from '$lib/server/vercel';

export const load = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized');
   }
   let dbDeployment = await prisma.vercelDeployment.create({
      data: {
         userId:event.locals.user.id,
      }
   });
   console.log(dbDeployment)
   const projectList = await vercelClient.projects.getProjects({});
   for(const project of projectList.projects){
      if(project.name === `mms-demo-${event.locals.user.familyName.toLowerCase()}-${event.locals.user.givenName.toLowerCase()}`){
         console.log(project)
         if(!dbDeployment.name || dbDeployment.vercelId){
            dbDeployment = await prisma.vercelDeployment.update({
               where: {
                  id: dbDeployment.id
               },
               data: {
                  name: dbDeployment.name,
                  vercelId: dbDeployment.vercelId
               }
            })
         }
         return {project}
      }
   }
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
   dbDeployment = await prisma.vercelDeployment.update({
      where: {
         id: dbDeployment.id
      },
      data: {
         vercelId: project.id,
         name: project.name,
      }
   })
   console.log('dbDeployment',dbDeployment)
   return {project};
}) satisfies PageServerLoad;