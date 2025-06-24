<script lang="ts">
   import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";  
   import TextInput from '$lib/formComponents/TextInput.svelte';
   import type { EmailVerificationFormSchema } from "$lib/formSchemas/schemas";
   import FormProgress from "$lib/formComponents/FormSubmitWithProgress.svelte";
   import FormMessage from "$lib/formComponents/FormMessage.svelte";
	import { onMount } from "svelte";
   
   interface Props {
      data: SuperValidated<Infer<EmailVerificationFormSchema>>; 
      emailVerificationModalOpen?: boolean;
      userId: string;
      redirect: string;
      classes?: string;
   }
   let {
      data, 
      emailVerificationModalOpen=$bindable(),
      userId,
      redirect=$bindable(''),
      classes,
   }:Props = $props();
   let { form, errors, constraints, message, enhance, submitting, delayed, timeout } = superForm(data, {
      onSubmit(){
      }, 
      onUpdated(event) {
         emailVerificationModalOpen = false;
       },
   });
   let emailAddress = $state('');
   let mounted = $state(false)
   onMount(async () => {
      const response = await fetch('/api/sendEmailVerification', {
         method: 'POST',
         body: JSON.stringify({userId})
      })
      const body = await response.json();
      if(body.email){
         emailAddress = body.email
      }
      mounted = true;
   })
   async function resend(){
      mounted = false
      const response = await fetch('/api/sendEmailVerification', {
         method: 'POST',
         body: JSON.stringify({userId})
      })
      const body = await response.json()
      if(body.email){
         emailAddress = body.email
      }
      mounted = true
   }
</script>
<div class={classes}>
   <FormMessage message={$message} />
   {#if emailAddress !== ''}
      <div>
         An email has been sent to {emailAddress}, please enter the code contained below
      </div>
   {/if}
   {#if mounted}
      <form method="POST" action="/register/emailVerification?/verify&redirect={redirect}" use:enhance>
         <TextInput
         label="Code: "
         name="code"
         bind:value={$form.code}
         errors={$errors.code}
         constraints={$constraints.code}
         placeholder='12345678'
         />
         <FormProgress delayed={$delayed} timeout={$timeout}/>
      </form>
      <button class="btn preset-filled-primary-50-950 rounded-lg" onclick={()=>resend()}>Resend email</button>
   {:else}
      Sending verification...
   {/if}
   {#if emailVerificationModalOpen !== undefined}
      <button class="btn preset-filled-primary-50-950 rounded-lg" onclick={()=> emailVerificationModalOpen = false}>Close</button>
   {/if}
</div>