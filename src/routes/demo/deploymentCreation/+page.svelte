<script lang="ts">
	import { onMount } from 'svelte';
   import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

   let { data }: { data: PageData } = $props();
   let mounted= $state(false);
   onMount(()=> {
      mounted= true;
      setTimeout(()=>{
         goto(`/demo/envVars?projectId=${data.project?.id}`)
      }, 500)
   })
</script>
{#if !mounted}
   <div class="mt-10">Creating Demo website</div>
{:else}
   <div class="mt-10">Site created...</div>
{/if}

