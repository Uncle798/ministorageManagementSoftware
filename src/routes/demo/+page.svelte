<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { fromStore } from 'svelte/store';
   import type { PageData } from './$types';
   import { source } from 'sveltekit-sse';

   let { data }: { data: PageData } = $props();
   const value = source('/api/createDemo').select('message');
   const alias = source('/api/createDemo').select('alias');
   const tokenStore = source('/api/createDemo').select('token');
   const aliasState = $state(fromStore(alias));
   const tokenState = $state(fromStore(tokenStore));
   $effect(()=>{
      if(aliasState.current !== ''){ 
         window.location.assign(`https://${aliasState.current}`);
      }
      if(tokenState.current !== ''){
         fetch('/api/createDemo/setCookie', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({token:tokenState.current})
         })
      }
   })
   beforeNavigate(async(navigation)=>{
      console.log(tokenState.current)
      navigation.cancel();
   })
</script>
<div class="mt-10 mx-2">

   Message: {$value}
   <div>
      Alias: {$alias}
   </div>
   <div>
      State: {aliasState.current}
   </div>
</div>