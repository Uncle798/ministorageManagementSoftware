<script lang="ts">
   interface Props {
      title: string
   }
   let { title }:Props = $props();
   
</script>
<svelte:head>
	<title>MMS | {title}</title>
</svelte:head>
