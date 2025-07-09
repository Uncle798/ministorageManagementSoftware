<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { fromStore } from 'svelte/store';
   import type { PageData } from './$types';
   import { source } from 'sveltekit-sse';

   let { data }: { data: PageData } = $props();
   const value = source('/api/createDemo').select('message');
   const alias = source('/api/createDemo').select('alias');
   const tokenStore = source('/api/createDemo').select('token');
   const aliasState = $state(fromStore(alias));
   const tokenState = $state(fromStore(tokenStore));
   let redirecting = $state<string>()
   $effect(()=>{
      if(aliasState.current !== ''){
         redirecting = 'Redirecting to ' + aliasState.current + '...'
         setTimeout(()=>{
            window.location.assign(`https://${aliasState.current}`);
         }, 2500);
      }
      if(tokenState.current !== ''){
         fetch('/api/createDemo/setCookie', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({token:tokenState.current})
         })
      }
   })
</script>
<Header title={$value} />
<div class="mt-10 mx-2">
   {#if redirecting}
      Redirecting to {redirecting}
   {:else}
      Status: {$value}
   {/if}
</div>