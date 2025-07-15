<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { fromStore } from 'svelte/store';
   import type { PageData } from './$types';
   import { source } from 'sveltekit-sse';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

   let { data }: { data: PageData } = $props();
   const connection = source('/api/createDemo')
   const value = connection.select('message');
   const alias = connection.select('alias');
   const tokenStore = connection.select('token');
   const aliasState = $state(fromStore(alias));
   const tokenState = $state(fromStore(tokenStore));
   let redirecting = $state<string>();
   let countdown = $state<number | string>(120);
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
   onMount(()=>{
      setInterval(()=>{
         if(typeof countdown === 'number'){
            countdown = countdown - 1;
            if(countdown <= 0){
               countdown = 'a few'
            }
         }

      }, 1000)
   })
   beforeNavigate(()=>{
      connection.close();
   })
</script>
<Header title={$value} />
<div class="mt-14 sm:mt-10 mx-2">
   {#if redirecting}
      {redirecting}
   {:else}
      Status: {$value}
      <p>
         Come back in about {countdown} seconds and we'll have built something just for you.
      </p>
   {/if}
</div>