import { softwareEnvVars } from '$lib/server/envVars';
import { prisma } from '$lib/server/prisma';
import { vercelClient } from '$lib/server/vercel';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { userId } = body;
   if(!userId){
      return new Response(JSON.stringify('User Id not provided'), {status:400});
   }
   const dbDeployment = await prisma.vercelDeployment.create({
      data: {
         userId,
      }
   });
   try {
      const project = await vercelClient.projects.createProject({
         requestBody: {
            name: `mms-demo-${dbDeployment.id}`,
            framework: 'sveltekit',
            gitRepository: {
               type: 'github',
               repo:'mmsWebsiteSvelte5',
               
            }
         }
      })
      for(const envVars of softwareEnvVars){
         await vercelClient.projects.createProjectEnv({
            idOrName: project.id,
            upsert: 'true',
            requestBody: 
               {
                  key: envVars.key,
                  value: envVars.value,
                  type: 'plain',
                  target: ['production', 'development', 'preview']
               }
         })
      }
      const deployment = await vercelClient.deployments.createDeployment({
         requestBody: {
            name: project.name,
            target: 'production',
            gitSource: {
               org: 'Uncle798',
               repo: 'mmsWebsiteSvelte5',
               ref: 'main',
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
      })
      return new Response(JSON.stringify(deployment), {status: 200});
   } catch (error) {
      console.error(error instanceof Error ? `Error: ${error.message}` : String(error));
   }
   
   return new Response();
};