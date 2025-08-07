import { CRON_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/prisma';
import dayjs from 'dayjs';
import type { RequestHandler } from './$types';
import { sendStatusEmail } from '$lib/server/mailtrap';

export const GET: RequestHandler = async ({request, fetch}) => {
   const authHeader = request.headers.get('authorization')
   if(authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({success:false}), {status: 401})
   }
   const demos = await prisma.demo.findMany();
   let numDemosYesterday = 0;
   for(const demo of demos){
      if(dayjs().diff(demo.updatedAt, 'hours') >= 24){
         await fetch('/api/destroyDemo', {
            method: 'POST',
            body: JSON.stringify({
               userId:demo.userId
            })
         })
      }
      if(demo.createdAt.getDate() === dayjs().subtract(1, 'day').toDate().getDate()){
         numDemosYesterday += 1;
      }
   }
   const admins = await prisma.user.findMany({
      where: {
         admin: true
      }
   })
   
   for(const admin of admins){
      await sendStatusEmail(admin.email, numDemosYesterday);
   }
   return new Response(JSON.stringify({success:true}), {status: 200});
};