<script lang="ts">
	import { source } from 'sveltekit-sse';
   import type { PageData } from './$types';
	import { fromStore } from 'svelte/store';
	import { goto } from '$app/navigation';

   let { data }: { data: PageData } = $props();
   const message = source('/api/destroyDemo', {
      options: {
         body: JSON.stringify({userId:data.user?.id})
      }
   }).select('message');
   let messageState = $state(fromStore(message))
   $effect(()=>{
      if(messageState.current === 'Everything deleted'){
         setTimeout(()=>{
            goto('/')
         }, 2500)
      }
   })
</script>

<div class="mt-14 sm:mt-10 mx-2">
   Message: {$message}
</div>