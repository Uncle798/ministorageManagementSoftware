
import { NEON_API_ROLE_PASSWORD } from '$env/static/private';
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
      },
      include: {
         user: true
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
      const dbBranch = await prisma.databaseBranch.findFirst({
         where: {
            userId,
         }
      })
      console.log('dbBranch.url', dbBranch?.url)
      if(dbBranch?.url){
         await vercelClient.projects.createProjectEnv({
            idOrName: project.id,
            upsert: 'true',
            requestBody: {
               key: 'POSTGRES_PRISMA_URL',
               value: `postgresql://api:${NEON_API_ROLE_PASSWORD}@${dbBranch.url}/Demo01?sslmode=require&channel_binding=require`,
               type: 'plain',
               target: ['development', 'preview', 'production']
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
      })
      return new Response(JSON.stringify(deployment), {status: 200});
   } catch (error) {
      console.error(error instanceof Error ? `Error: ${error.message}` : String(error));
   }
   return new Response();
};