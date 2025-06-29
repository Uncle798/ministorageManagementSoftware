import { prisma } from '$lib/server/prisma';
import { vercelClient } from '$lib/server/vercel';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { userId } = body;
   if(!userId){
      return new Response(JSON.stringify('User Id not provided'), {status:400})
   }
   const dbDeployments = await prisma.vercelDeployment.findMany({
      where: {
         userId,
      }
   })
   const projectList = await vercelClient.projects.getProjects({});
   for(const dbDeployment of dbDeployments){
      for(const project of projectList.projects){
         if(project.name === dbDeployment.name){
            await vercelClient.projects.deleteProject({
               idOrName:project.id
            })
            await prisma.vercelDeployment.delete({
               where:{
                  id: dbDeployment.id
               }
            })
         }
      }
   }
   return new Response(JSON.stringify('deployments deleted'), {status: 200});
};