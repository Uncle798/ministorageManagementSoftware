import { softwareEnvVars } from '$lib/server/envVars';
import { vercelClient } from '$lib/server/vercel';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { NEON_API_ROLE_PASSWORD } from '$env/static/private';
import { generateSessionToken, setDemoSessionTokenCookie } from '$lib/server/authUtils';
import dayjs from 'dayjs';

export const load = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized');
   }
   const projectId = event.url.searchParams.get('projectId');
   if(projectId){
      for(const envVar of softwareEnvVars){
         await vercelClient.projects.createProjectEnv({
            idOrName: projectId,
            upsert: 'true',
            requestBody: {
               key: envVar.key,
               value: envVar.value,
               type: 'plain',
               target: ['preview', 'development', 'production']
            }
         })
      }
      const dbBranch = await prisma.databaseBranch.findFirst({
         where: {
            userId:event.locals.user.id,
         }
      });
      if(dbBranch?.url){
         await vercelClient.projects.createProjectEnv({
            idOrName: projectId,
            upsert: 'true',
            requestBody: {
               key: 'POSTGRES_PRISMA_URL',
               value: `postgresql://api:${NEON_API_ROLE_PASSWORD}@${dbBranch.url}/Demo01?sslmode=require&channel_binding=require`,
               type: 'plain',
               target: ['development', 'preview', 'production']
            }
         })
      }
      await vercelClient.projects.createProjectEnv({
         idOrName: projectId,
         upsert: 'true',
         requestBody: {
            key: 'PUBLIC_COMPANY_NAME',
            value: event.locals.user.companyName!,
            type: 'plain',
            target: ['development', 'preview', 'production']
         }
      })
      const token = generateSessionToken();
      interface EnvVars {
         key: string | undefined,
         value: string | undefined,
      }
      const userEnvVars:EnvVars[] = [
         {key: 'USER_GIVEN_NAME', value: event.locals.user.givenName},
         {key: 'USER_FAMILY_NAME', value: event.locals.user.familyName},
         {key: 'USER_EMAIL', value: event.locals.user.email},
         {key: 'PUBLIC_COMPANY_NAME', value: event.locals.user.companyName!},
         {key: 'DEMO_SESSION_TOKEN', value: token},
         {key: 'PUBLIC_COMPANY_URL', value: `demo-${event.locals.user.familyName}-${event.locals.user.givenName}.ministoragemanagementsoftware.com`}
      ]
      for(const envVar of userEnvVars){
         if(envVar.key !== undefined && envVar.value !== undefined)
         await vercelClient.projects.createProjectEnv({
            idOrName: projectId,
            upsert: 'true',
            requestBody: {
               key: envVar.key,
               value: envVar.value,
               type: 'plain',
               target: ['development', 'preview', 'production']
            }
         })
      }
      setDemoSessionTokenCookie(event, token, dayjs().add(1, 'month').toDate());
      return {projectId};
   }
}) satisfies PageServerLoad;