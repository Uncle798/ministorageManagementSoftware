import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async (event) => {
   if(!event.locals.user?.admin){
      redirect(302, '/login?toastReason=admin');
   }
   const usersPromise = prisma.user.findMany();
   return {usersPromise};
}) satisfies PageServerLoad;