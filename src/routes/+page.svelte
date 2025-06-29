<script lang="ts">
	import { ObjectParser } from "@pilcrowjs/object-parser";
	import type { PageData } from "./$types";
	import RegisterForm from "$lib/forms/RegisterForm.svelte";
	import Header from "$lib/Header.svelte";

   interface Props {
      data: PageData
   }
   let { data }:Props = $props();
   let branchElement = $state<HTMLDivElement>();
   const getBranches = async function () {
      const res = await fetch('/api/listBranches', {
            method: 'GET'
         }).then(async (res) => {
            return await res.json()
         })
      if(branchElement){
         branchElement.innerHTML = res
      }
   }
</script>
<Header title="Home" />
<div class="mt-10 mx-2">
   <h1>Welcome to Ministorage Management Software</h1>
   <p>
      If you're looking for software to manage your self-storage business you've found a home-grown solution. I'm a second generation storage owner and, now a software developer. 
      Ministorage Management Software is a fully featured web-based solution for both customers and owners built with the latest, most secure, open source frameworks. Customers can sign legally binding contracts from their computer or phone.
      They can sign up for credit card auto-pay without leaving your website. Invoices are automatically generated each day and emailed to customers with a summary of your income emailed to you. 
      Credit cards are managed by <a href="https://www.elavon.com" class="anchor">Elavon</a> so your customers data is safe and secure, and you get some of the lowest processing fees around. 
   </p>
   <p>
      Looking for a demo? Fill this out to get a personalized demo. I will not spam you or contact you except to verify your email address.
      <RegisterForm data={data.registerForm} redirectTo='demo'/>
   </p>
   {#if data.user?.admin}  
      <button class="btn preset-filled-primary-50-950" onclick={async ()=>{
         console.log(data.user?.id)
         await fetch('/api/createDB', {
            method: 'POST',
            body: JSON.stringify({userId: data.user?.id})
         })
      }}>create branch</button>
      <button class="btn preset-filled-primary-50-950" onclick={()=>getBranches()}>list branches</button>
      <div bind:this={branchElement}></div>
      <button class="btn preset-filled-primary-50-950" onclick={async()=>{
         await fetch('/api/deleteBranch', {
            method: 'POST',
            body: JSON.stringify({userId:data.user?.id})
         })
      }}>delete branch</button>
      <button class="btn preset-filled-primary-50-950" onclick={async()=>{
         await fetch('/api/createDeployment', {
            method: 'POST',
            body: JSON.stringify({userId:data.user?.id})
         })
      }}>Create deployment</button>
      <button class="btn preset-filled-primary-50-950" onclick={async()=>{
         await fetch('/api/deleteDeployment', {
            method: 'POST',
            body: JSON.stringify({userId:data.user?.id})
         })
      }}>Delete deployment</button>
      <button class="btn preset-filled-primary-50-950" onclick={async()=>{
         await fetch('/api/listDnsRecords', {
            method: 'POST',
         })
      }}>list dns records</button>
   {/if}
</div>
