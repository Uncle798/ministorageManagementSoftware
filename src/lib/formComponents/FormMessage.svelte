<script lang='ts'>
   interface Props {
      message: string | null,
   }
   let { message = $bindable(), }:Props = $props();
</script>

{#if message}
   <span>{message}</span>
{/if}