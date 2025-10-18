<script lang='ts'>
   import ProgressLine from "$lib/displayComponents/ProgressLine.svelte";
   import ProgressRing from "$lib/displayComponents/ProgressRing.svelte";
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
      <ProgressRing value={null} classes='mx-1' />
   </div>
   {/if}
   {#if timeout}
   <div transition:fade={{duration:600}}>
      <ProgressLine value={null} />
   </div>
   {/if}
</div>