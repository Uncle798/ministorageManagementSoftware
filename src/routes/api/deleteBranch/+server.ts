import { NEON_PROJECT_ID } from '$env/static/private';
import { neonClient } from '$lib/server/neon';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   const { userId } = body
   const dbBranches = await prisma.databaseBranch.findMany({
      where: {
         userId
      }
   })
   const branchList = await neonClient.listProjectBranches({projectId:NEON_PROJECT_ID})
   for(const dbBranch of dbBranches){
      for(const branch of branchList.data.branches){
         if(branch.name === dbBranch?.id){
            await neonClient.deleteProjectBranch(NEON_PROJECT_ID, branch.id);
            await prisma.databaseBranch.delete({
               where: {
                  id:dbBranch.id
               }
            })
         }
      }
   }
   return new Response();
};