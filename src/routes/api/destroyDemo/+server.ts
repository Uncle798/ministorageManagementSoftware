import { NEON_PROJECT_ID } from '$env/static/private';
import { neonClient } from '$lib/server/neon';
import { prisma } from '$lib/server/prisma';
import { vercelClient } from '$lib/server/vercel';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { userId } = body;
   if(!userId){
      return new Response(JSON.stringify('User Id not specified'), {status:400});
   }
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
            await vercelClient.deployments.deleteDeployment({
               id: deployment.vercelId
            })
         }
         await prisma.vercelDeployment.deleteMany({
            where: {
               userId,
            }
         })
      }
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
   } catch (error) {
      console.error(error)
   }
   return new Response(JSON.stringify('Everything deleted'), {status: 200});
};