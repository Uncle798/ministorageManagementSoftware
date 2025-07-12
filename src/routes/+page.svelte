<script lang="ts">
	import type { PageData } from "./$types";
	import RegisterForm from "$lib/forms/RegisterForm.svelte";
	import Header from "$lib/Header.svelte";
	import { goto } from "$app/navigation";

   interface Props {
      data: PageData
   }
   let { data }:Props = $props();
   let deleted = $state<string>();
</script>
<Header title="Home" />
<div class="mt-14 sm:mt-10 mx-2">
   <h1>Welcome to Ministorage Management Software</h1>
   <p>
      If you're looking for software to manage your self-storage business you've found a home-grown solution. I'm a second generation storage owner and, now a software developer. 
      Ministorage Management Software is a fully featured web-based solution for both customers and owners built with the latest, most secure, open source frameworks. Customers can sign legally binding contracts from their computer or phone.
      They can sign up for credit card auto-pay without leaving your website. Invoices are automatically generated each day and emailed to customers with a summary of your income emailed to you. 
      Credit cards are managed by <a href="https://www.elavon.com" class="anchor">Elavon</a> so your customers data is safe and secure, and you get some of the lowest processing fees around. 
   </p>
   <p>
      Looking for a demo? Fill this out to get a personalized demo. I will not spam you or contact you except to verify your email address.
   </p>
   <RegisterForm data={data.registerForm} redirectTo='demo'/>
   <p>
      Interested in using Ministorage Management Software for your mini-storage? Shoot me an email and we can start the process! I can help you convert your spreadsheets and get your current customers on the platform. Customers will appreciate being able to 
      manage their payments and you'll appreciate having all 
   </p>
   {#if data.user?.admin}  
      <button class="btn preset-filled-primary-50-950" onclick={async()=>{
         await goto('/demo')
      }}>Create Demo</button>
      <button class="btn preset-filled-primary-50-950" onclick={async()=>{
         await goto('/destroyDemo')
      }}>Delete All Demos</button>
      {#if deleted}
         {deleted}
      {/if}
   {/if}
</div>
