<script lang="ts">
	import { onMount } from 'svelte';
   import type { PageData } from './$types';
	import { goto } from '$app/navigation';

   let { data }: { data: PageData } = $props();
   let mounted = $state(false)
   onMount(()=>{
      mounted=true;
      setTimeout(()=>{
         goto('/demo/deploymentCreation')
      }, 500)
   })
</script>
{#if !mounted}
   <div class="mt-10">
      Creating personalized Database
   </div>
   {:else}
   <div class="mt-10">Database created</div>
{/if}