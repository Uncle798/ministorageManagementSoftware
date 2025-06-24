<script lang="ts">
	import type { PageData } from "./$types";

   interface Props {
      data: PageData
   }
   let { data }:Props = $props();
</script>
<div>
   <h1>Welcome to Ministorage Management Software</h1>
   <p>
      If you're looking for software to manage your self-storage business you've found a home-grown solution. I'm a second generation storage owner and, now a software developer. 
      Ministorage Management Software is a fully featured web-based solution for both customers and owners built with the latest, most secure, open source frameworks. Customers can sign legally binding contracts from their computer or phone.
      They can sign up for credit card auto-pay without leaving your website. Invoices are automatically generated each day and emailed to customers with a summary of your income emailed to you. 
      Credit cards are managed by <a href="https://www.elavon.com" class="anchor">Elavon</a> so your customers data is safe and secure, and you get some of the lowest processing fees around. 
   </p>
   <p>

   </p>
   {#if data.user?.admin}  
      <button class="btn preset-filled-primary-50-950" onclick={async ()=>{
         await fetch('/api/createDB', {
            method: 'POST'
         })
      }}>create branch</button>
      <button class="btn preset-filled-primary-50-950" onclick={async ()=>{
         await fetch('/api/listBranches', {
            method: 'GET'
         })
      }}>list branches</button>
   {/if}
</div>
