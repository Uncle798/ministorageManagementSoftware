<script lang="ts">
   import { superForm } from "sveltekit-superforms";  
	import type { PageData } from "./$types";

	import Header from "$lib/Header.svelte";
	import { fade } from "svelte/transition";
	import RegisterForm from "$lib/forms/RegisterForm.svelte";
	import { getContext, onMount } from "svelte";
   interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { form, errors, constraints, message, enhance, delayed, timeout } = superForm(data.registerForm)

</script>
<Header title='Register a new account' />
<div class="m-2 mt-14 sm:mt-10" in:fade={{duration:600}}>
   <RegisterForm data={data.registerForm}/>
	<div class="flex flex-col">
		Or, 
		<a href="/login/google?redirectTo={data.redirectTo}&unitNum={data.unitNum}" class="anchor">Sign in with Google</a>
		<a href="/login/yahoo?redirectTo={data.redirectTo}&unitNum={data.unitNum}" class="anchor">Sign in with Yahoo!</a>
		<a href="/login?redirectTo={data.redirectTo}&unitNum={data.unitNum}" class="anchor">Already have an account? Login here.</a>
	</div>
</div>