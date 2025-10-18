<script lang="ts">
   import { Progress } from "@skeletonlabs/skeleton-svelte";
   interface Props {
      value: number | null;
      height?: string 
      classes?: string;
   }
   let { value = null, height='h-4', classes }:Props = $props();
</script>
<div class="classes">
   <Progress {value} class='items-center w-fit'>
      <Progress.Track class='stroke-secondary-50-950 {height}'> 
         <Progress.Range class='stroke-secondary-600-400' />
      </Progress.Track>
   </Progress>
</div>