import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { registerFormSchema } from '$lib/formSchemas/schemas';

export const load = (async () => {
   const registerForm = await superValidate(valibot(registerFormSchema));
   return {registerForm};
}) satisfies PageServerLoad;