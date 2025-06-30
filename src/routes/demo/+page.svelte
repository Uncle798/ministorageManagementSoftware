<script lang="ts">
	import { goto } from '$app/navigation';
	import { fromStore } from 'svelte/store';
   import type { PageData } from './$types';
   import { source } from 'sveltekit-sse';

   let { data }: { data: PageData } = $props();
   const value = source('/api/createDemo').select('message');
   const alias = source('/api/createDemo').select('alias');
   const state = $state(fromStore(alias));
   $effect(()=>{
      if(state.current !== ''){ 
         console.log(state.current)
         window.location.assign(`https://${state.current}`);
      }
   })
</script>
<div class="mt-10 mx-2">

   Message: {$value}
   <div>
      Alias: {$alias}
   </div>
   <div>
      State: {state.current}
   </div>
</div>