<script lang="ts">
   import { Progress } from "@skeletonlabs/skeleton-svelte";
   interface Props {
      value: number | null;
      size?: string;

      classes?: string;
   }
   let { value = null, size='30px', classes }:Props = $props();
</script>

<Progress {value} class='items-center w-fit {classes}'>
   <Progress.Circle style='--size: {size}; --thickness: 3px'>
      <Progress.CircleTrack class='stroke-secondary-50-950'/>
      <Progress.CircleRange class='stroke-secondary-600-400'/>
   </Progress.Circle>
</Progress>