import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login?toastReason=unauthorized')
   }
   return {};
}) satisfies PageServerLoad;