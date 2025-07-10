<script lang="ts">
   import EmailInput from '$lib/formComponents/EmailInput.svelte';
   import { onMount } from 'svelte';
   import FormSubmitWithProgress from '$lib/formComponents/FormSubmitWithProgress.svelte';
   import { toaster } from '../toaster';
   import { superForm } from 'sveltekit-superforms';
   import type { PageData } from './$types';
   import FormMessage from '$lib/formComponents/FormMessage.svelte';
   import Header from '$lib/Header.svelte';
   import { fade } from 'svelte/transition';
   
   export let data: PageData;
   let { form, message, errors, constraints, enhance, delayed, timeout } = superForm(data.magicLinkForm);
   const toastReason = data.toastReason;
   onMount(() => {
      if(toastReason === 'userAlreadyExists'){
         toaster.create({
            title: 'Email already in use',
            description: 'That email has been used already please login',
            type: 'info'
         })
      }
      if(toastReason === 'unauthorized'){
         toaster.create({
            title: 'You must be logged in to access that page',
            description: 'To access that page please log in',
            type: 'error'
         })
      }
      if(toastReason === 'admin'){
         toaster.create({
            title: 'Unauthorized',
            description: 'To access that page you must be an Administrator',
            type: 'error'
         })
      }
      if(toastReason === 'employee'){
         toaster.create({
            title: 'Unauthorized',
            description: 'To access that page you must be an employee',
            type: 'error'
         })
      }
      if(toastReason === 'linkExpired'){
         toaster.create({
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
</div>