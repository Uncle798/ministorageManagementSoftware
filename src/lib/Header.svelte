<script lang="ts">
   import { PUBLIC_URL } from "$env/static/public";
   interface Props {
      title: string
   }
   let { title }:Props = $props();
   
</script>
<svelte:head>
	<title>MMS | {title}</title>
   <meta content={`${PUBLIC_URL}/api/og?message=${title}`} property="og:image"/>
</svelte:head>
