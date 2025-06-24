
import { valibot } from 'sveltekit-superforms/adapters';

import { registerFormSchema } from "$lib/formSchemas/schemas";
import { superValidate, } from 'sveltekit-superforms';


import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = (async (event) =>{
	const unitNum = event.url.searchParams.get('unitNum');
   const registerForm = await superValidate(valibot(registerFormSchema))
	const redirectTo = event.url.searchParams.get('redirectTo');
   const toastReason = event.url.searchParams.get('toast')
   return { unitNum, registerForm, redirectTo, toastReason }
})


