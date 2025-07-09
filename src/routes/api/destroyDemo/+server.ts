
import { NEON_PROJECT_ID } from '$env/static/private';
import { neonClient } from '$lib/server/neon';
import { prisma } from '$lib/server/prisma';
import { vercelClient } from '$lib/server/vercel';
import { produce } from 'sveltekit-sse';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { userId } = body;
   if(!userId){
      return new Response(JSON.stringify('User Id not specified'), {status:400});
   } else {
      return produce(async function start({emit}) {
         const {error} = emit('message', 'Deleting deployment')
         try {
            const dbProjects = await prisma.vercelProject.findMany({
               where:{
                  userId,
               }
            })
            const dbDeployments = await prisma.vercelDeployment.findMany({
               where: {
                  userId
               }
            })
            if(dbDeployments){
               for(const deployment of dbDeployments){
                  emit('message', deployment.vercelId)
                  try {
                     await vercelClient.deployments.deleteDeployment({
                        id: deployment.vercelId
                     })
                     await prisma.vercelDeployment.deleteMany({
                        where: {
                           userId,
                        }
                     })  
                  } catch (error) {
                     emit('message', String(error))
                  }
               }
            }
            emit('message', 'Deleting project')
            if(dbProjects){
               for(const project of dbProjects){
                  await vercelClient.projects.deleteProject({
                     idOrName: project.vercelId
                  }) 
               }
               await prisma.vercelProject.deleteMany({
                  where: {
                     userId,
                  }
               })
            }
            emit('message', 'Deleting branch')
            const dbBranches = await prisma.databaseBranch.findMany({
               where: {
                  userId
               }
            })
            if(dbBranches){
               for(const branch of dbBranches){
                  if(branch.neonId){
                     await neonClient.deleteProjectBranch(NEON_PROJECT_ID, branch.neonId);
                  }
               }
               await prisma.databaseBranch.deleteMany({
                  where: {
                     userId,
                  }
               })
            }
            await prisma.demo.deleteMany({
               where: {
                  userId,
               }
            })
            emit('message', 'Everything deleted')
         } catch (error) {
            console.error(error)
         }
         console.log(error)
         return function cancel(){};
      })
   }
};