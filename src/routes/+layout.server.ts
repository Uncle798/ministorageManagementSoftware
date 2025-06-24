import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
   const {user} = event.locals;
   return { user };
}) satisfies LayoutServerLoad;