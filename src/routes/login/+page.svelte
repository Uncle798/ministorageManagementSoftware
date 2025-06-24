<script lang="ts">
    import EmailInput from '$lib/formComponents/EmailInput.svelte';
    import { getContext, onMount } from 'svelte';
    import FormSubmitWithProgress from '$lib/formComponents/FormSubmitWithProgress.svelte';
    import type { ToastContext, } from '@skeletonlabs/skeleton-svelte'
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	import FormMessage from '$lib/formComponents/FormMessage.svelte';
	import Header from '$lib/Header.svelte';
	import { redirect } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';
    
    export let data: PageData;
    let { form, message, errors, constraints, enhance, delayed, timeout } = superForm(data.magicLinkForm);
    export const toast:ToastContext = getContext('toast');
    const toastReason = data.toastReason;
    onMount(() => {
        if(toastReason === 'userAlreadyExists'){
            toast.create({
                title: 'Email already in use',
                description: 'That email has been used already please login',
                type: 'info'
            })
        }
        if(toastReason === 'unauthorized'){
            toast.create({
                title: 'You must be logged in to access that page',
                description: 'To access that page please log in',
                type: 'error'
            })
        }
        if(toastReason === 'admin'){
            toast.create({
                title: 'Unauthorized',
                description: 'To access that page you must be an Administrator',
                type: 'error'
            })
        }
        if(toastReason === 'employee'){
            toast.create({
                title: 'Unauthorized',
                description: 'To access that page you must be an employee',
                type: 'error'
            })
        }
        if(toastReason === 'linkExpired'){
            toast.create({
                title: 'The link has expired',
                description: 'Links are only valid for 5 minutes, please enter your email address again',
                type: 'error'
            })

        }
    })
</script>
<Header title="Login" />
<div class="m-2 mt-9" in:fade={{duration:600}}>
    <p class="h2 ">Please enter your email to login </p>
    <div class="h4">
        <FormMessage message={$message} />
    </div>
    
    <form method="post" use:enhance >
        <EmailInput
        bind:value={$form.email}
        errors={$errors.email}
        constraints={$constraints.email}
        label='Registered email address: '
        name='email'
        />
        <FormSubmitWithProgress delayed={$delayed} timeout={$timeout} buttonText='Email me a link to login'/>
    </form>
    <div class="flex flex-col">
		<a href="/login/google?redirectTo={data.redirectTo}&unitNum={data.unitNum}&invoiceNum={data.invoiceNum}&paymentRecordNum={data.paymentRecordNum}" class="anchor">Sign in with Google</a>
		<a href="/login/yahoo?redirectTo={data.redirectTo}&unitNum={data.unitNum}&invoiceNum={data.invoiceNum}&paymentRecordNum={data.paymentRecordNum}" class="anchor">Sign in with Yahoo!</a>
        <a href="/register?redirectTo={data.redirectTo}&unitNum={data.unitNum}&invoiceNum={data.invoiceNum}&paymentRecordNum={data.paymentRecordNum}" class="anchor">Register new account</a>
    </div>
</div>