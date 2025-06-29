<script lang="ts">
	import { mount, onMount } from 'svelte';
   import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

   let { data }: { data: PageData } = $props();
   let  mounted = $state(false);
   onMount(()=>{
      mounted=true;
      setTimeout(()=>{
         goto(`/demo/deployment?projectId=${data.projectId}`)
      })
   })
</script>

<div class="mt-10">
   {#if !mount}
      Personalizing details,
      {:else}
      Details personalized
   {/if}
</div>