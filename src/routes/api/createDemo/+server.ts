import { produce } from 'sveltekit-sse'
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { neonClient } from '$lib/server/neon';
import { NEON_PROJECT_ID, NEON_API_ROLE_PASSWORD } from '$env/static/private';
import { EndpointType } from '@neondatabase/api-client';
import { vercelClient } from '$lib/server/vercel';
import { softwareEnvVars } from '$lib/server/envVars';
import { generateSessionToken,} from '$lib/server/authUtils';

export const POST: RequestHandler = async (event) => {
   if(!event.locals.user){
      return new Response(JSON.stringify('Must be logged into to create demo'));
   } else {
      return produce(async function start({emit}) {
         emit('message', 'Creating database');
         try{
            let dbBranch = await prisma.databaseBranch.findFirst({
               where: {
                  userId: event.locals.user!.id
               }
            })
            if(!dbBranch){
               dbBranch = await prisma.databaseBranch.create({
                  data: {
                     userId: event.locals.user!.id
                  }
               })
            }
            const branchList = await neonClient.listProjectBranches({
               projectId: NEON_PROJECT_ID
            })
            let branch;
            let endpoint;
            for(const b of branchList.data.branches){
               if(b.id === dbBranch.neonId){
                  branch = await neonClient.getProjectBranch(NEON_PROJECT_ID, b.id);
                  const endpointList = await neonClient.listProjectEndpoints(NEON_PROJECT_ID);
                  for(const eP of endpointList.data.endpoints){
                     if(eP.branch_id === b.id){
                        endpoint = await neonClient.getProjectEndpoint(NEON_PROJECT_ID, eP.id)

                     }
                  }
               }
            }
            if(!branch){
               branch = await neonClient.createProjectBranch(NEON_PROJECT_ID, {
                  endpoints: [
                     {
                        type: EndpointType.ReadWrite,
                        provisioner: 'k8s-neonvm',
                        autoscaling_limit_max_cu: 0.25,
                        autoscaling_limit_min_cu: 0.25,
                     }
                  ],
                  branch: {
                     parent_id: 'br-plain-feather-aabanb4l',
                     name: dbBranch.id
                  }
               })
               endpoint = await neonClient.getProjectEndpoint(NEON_PROJECT_ID, branch.data.endpoints[0].id)
            }
            dbBranch = await prisma.databaseBranch.update({
               where: {
                  id: dbBranch.id,
               },
               data: {
                  neonId: branch.data.branch.id,
                  url: endpoint?.data.endpoint.host
               }
            });
            emit('message', 'Database Created');
            let dbDeployment = await prisma.vercelDeployment.findFirst({
               where: {
                  userId: event.locals.user!.id
               }
            });
            if(!dbDeployment){
               dbDeployment = await prisma.vercelDeployment.create({
                  data: {
                     userId: event.locals.user!.id
                  }
               })
            }
            let project;
            const projectList = await vercelClient.projects.getProjects({});
            for(const p of projectList.projects){
               if(p.name === `mms-demo-${event.locals.user!.familyName.toLowerCase()}-${event.locals.user!.givenName.toLowerCase()}`){
                  project = p;
                  if(!dbDeployment.name || !dbDeployment.vercelId){
                     dbDeployment = await prisma.vercelDeployment.update({
                        where: {
                           id: dbDeployment.id
                        },
                        data: {
                           name: project.name,
                           vercelId: project.id
                        }
                     })
                  }
               }
            }
            if(!project){
               project = await vercelClient.projects.createProject({
                  requestBody: {
                     name: `mms-demo-${event.locals.user!.familyName.toLowerCase()}-${event.locals.user!.givenName.toLowerCase()}`,
                     framework: 'sveltekit',
                     gitRepository: {
                        type: 'github',
                        repo: 'mmsWebsiteSvelte5',
                     }
                  }
               })
               dbDeployment = await prisma.vercelDeployment.update({
                  where: {
                     id: dbDeployment.id
                  },
                  data: {
                     name: project.name,
                     vercelId: project.id
                  }
               })
            }
            emit('message', 'Project created');
            for(const envVar of softwareEnvVars){
               await vercelClient.projects.createProjectEnv({
                  idOrName: project.id,
                  upsert: 'true',
                  requestBody: {
                     key: envVar.key,
                     value: envVar.value,
                     type: 'plain', 
                     target: ['development', 'preview', 'production']
                  }
               })
               emit('message', `${envVar.key} variable created`)
            }
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
            emit('message', 'Software environment variables created');
            const token = generateSessionToken();
            emit('token', token);
            interface EnvVars {
               key: string | undefined,
               value: string | undefined,
            }
            const userEnvVars:EnvVars[] = [
               {key: 'USER_GIVEN_NAME', value: event.locals.user!.givenName},
               {key: 'USER_FAMILY_NAME', value: event.locals.user!.familyName},
               {key: 'USER_EMAIL', value: event.locals.user!.email},
               {key: 'PUBLIC_COMPANY_NAME', value: event.locals.user!.companyName!},
               {key: 'DEMO_SESSION_TOKEN', value: token},
               {key: 'PUBLIC_COMPANY_URL', value: `demo-${event.locals.user!.familyName}-${event.locals.user!.givenName}.ministoragemanagementsoftware.com`}
            ]
            for(const envVar of userEnvVars){
               if(envVar.key !== undefined && envVar.value !== undefined)
               await vercelClient.projects.createProjectEnv({
                  idOrName: project.id,
                  upsert: 'true',
                  requestBody: {
                     key: envVar.key,
                     value: envVar.value,
                     type: 'plain',
                     target: ['development', 'preview', 'production']
                  }
               })
            }
            emit('message', 'Custom environment variables created');
            let deploymentStatus;
            let deployment;
            console.log(project.latestDeployments)
            if(project.latestDeployments?.length === 0){
               deployment = await vercelClient.deployments.createDeployment({
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
               emit('message', 'Deployment created');
               let ellipsis = '.'
               let i = 0;
               do {
                  await new Promise((resolve) => setTimeout(resolve, 5000));
                  const statusResponse = await vercelClient.deployments.getDeployment({
                     idOrUrl: deployment.id,
                     withGitRepoInfo: 'true'
                  })
                  if(statusResponse.status === deploymentStatus){
                     ellipsis += '.'
                  }
                  deploymentStatus = statusResponse.status;
                  if(i%3 === 0){
                     emit('message', 'Reticulating splines');
                  } else {
                     emit('message', deploymentStatus.substring(0,1) + deploymentStatus.substring(1).toLowerCase() + ellipsis);
                  }
                  i ++;
               } while(deploymentStatus === 'BUILDING' || deploymentStatus === 'INITIALIZING' || deploymentStatus === 'QUEUED');
            } else {
               deployment = project.latestDeployments![0];
               deploymentStatus = deployment?.readyState;
            }
            if(deploymentStatus){
               emit('message', deploymentStatus)
            }
            if(deploymentStatus === 'READY'){
               let alias;
               const aliasList = await vercelClient.aliases.listAliases({
                  projectId: project.id
               });
               for(const a of aliasList.aliases){
                  if(a.alias === `demo-${event.locals.user!.familyName.toLowerCase()}-${event.locals.user!.givenName.toLowerCase()}.ministoragemanagementsoftware.com`){
                     alias = a.alias;
                  }
               }
               if(!alias){
                  alias = await vercelClient.aliases.assignAlias({
                     id: deployment.id,
                     requestBody: {
                        alias: `demo-${event.locals.user!.familyName.toLowerCase()}-${event.locals.user!.givenName.toLowerCase()}.ministoragemanagementsoftware.com`,
                        redirect: null,
                     }
                  }).then((res) =>{
                     return res.alias
                  })
               }
               emit('domain', alias)
               emit('alias', alias)
            }
         } catch (error) {
            console.error(error);
         }
      })
   }
};