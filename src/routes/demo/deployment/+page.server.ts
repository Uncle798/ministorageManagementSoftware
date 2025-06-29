import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { vercelClient } from '$lib/server/vercel';
import { prisma } from '$lib/server/prisma';

export const load = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized')
   }
   const dbDeployment = await prisma.vercelDeployment.findFirst({
      where: {
         userId: event.locals.user.id
      }
   })
   if(dbDeployment?.name){
      const deployment = await vercelClient.deployments.createDeployment({
         requestBody: {
            name: dbDeployment.name,
            target: 'production',
            gitSource: {
               org: 'Uncle798',
               repo: 'mmsWebsiteSvelte5',
               ref: 'Demo',
               type: 'github'
            }
         }
      })
      await prisma.vercelDeployment.update({
         where: {
            id: dbDeployment.id
         },
         data: {
            vercelId: deployment.id
         }
      });
      let deploymentStatus;
      do {
         await new Promise((resolve) => setTimeout(resolve, 5000));
         const statusResponse = await vercelClient.deployments.getDeployment({
            idOrUrl: deployment.id,
            withGitRepoInfo: 'true',
         })
         deploymentStatus = statusResponse.status;
         
      } while (deploymentStatus !== 'READY');
      const alias = await vercelClient.aliases.assignAlias({
         id: deployment.id,
         requestBody: {
            alias: `demo-${event.locals.user.familyName}-${event.locals.user.givenName}.ministoragemanagementsoftware.com`,
            redirect: null,
         }
      })
      return {alias};
   }
}) satisfies PageServerLoad;