import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
   
   return new Response();

};

export const DELETE:RequestHandler = async (event) => {
   if(!event.locals.user?.admin){
      return new Response('Unauthorized', {status:401})
   }
   const body = await event.request.json();
   const { userId } = body;
   if(!userId) {
      return new Response('User Id not provided', {status: 400});
   }
   await prisma.verification.deleteMany({
      where: {
         userId
      }
   })
   await prisma.databaseBranch.deleteMany({
      where:{
         userId
      }
   });
   await prisma.vercelDeployment.deleteMany({
      where: {
         userId
      }
   })
   await prisma.demo.deleteMany({
      where: {
         userId
      }
   });
   await prisma.vercelProject.deleteMany({
      where: {
         userId
      }
   })
   await prisma.user.delete({
      where: {
         id: userId,
      }
   })
   return new Response('User deleted', {status:200})
}