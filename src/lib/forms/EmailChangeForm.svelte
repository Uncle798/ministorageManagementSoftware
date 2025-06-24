<script lang="ts">
   import EmailInput from '$lib/formComponents/EmailInput.svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { EmailFormSchema } from '$lib/formSchemas/schemas';
	import FormProgress from '$lib/formComponents/FormSubmitWithProgress.svelte';
	import FormMessage from '$lib/formComponents/FormMessage.svelte';
   interface Props {
      data: SuperValidated<Infer<EmailFormSchema>>;
      emailModalOpen: boolean;
      classes?: string;
   }

    let { data, emailModalOpen=$bindable(false), classes }:Props = $props();

   let { form, message, errors, constraints, enhance, delayed, timeout} = superForm(data, {
      onUpdated(){
         emailModalOpen=false;
      },   
   })
</script>
<div class={classes}>
   <FormMessage message={$message}/>
   <form action="/forms/emailUpdateForm" method="POST" use:enhance>
      <EmailInput
         bind:value={$form.email}
         errors={$errors.email}
         constraints={$constraints.email}
         label='Email'
         name='email'

      />
      <EmailInput
         bind:value={$form.confirmEmail}
         errors={$errors.confirmEmail}
         constraints={$constraints.confirmEmail}
         label='Confirm your email'
         name='confirmEmail'
      />
      <FormProgress delayed={$delayed} timeout={$timeout}/>
   </form>
</div>