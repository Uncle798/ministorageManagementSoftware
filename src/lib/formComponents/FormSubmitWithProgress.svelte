<script lang='ts'>
   import { Progress, ProgressRing } from "@skeletonlabs/skeleton-svelte";
	import { fade } from "svelte/transition";
   interface Props {
      delayed: boolean,
      timeout: boolean,
      buttonText?: string,
      classes?: string,
   }
   let { delayed = $bindable(), timeout=$bindable(), buttonText=$bindable('Submit'), classes }:Props = $props();
</script>
<div class="flex py-2 {classes}">
   <button class="btn rounded-lg preset-filled-primary-50-950 text-wrap h-fit sm:w-full" >{buttonText}</button>
   {#if delayed && !timeout}
   <div transition:fade={{duration:600}}>
      <ProgressRing value={null} size="size-8" strokeWidth="6px" meterStroke="stroke-secondary-600-400" trackStroke="stroke-secondary-50-950" classes='ml-2' />
   </div>
   {/if}
   {#if timeout}
   <div transition:fade={{duration:600}}>
      <Progress value={null} width="size-8" classes='mt-2 ml-2' />
   </div>
   {/if}
</div>