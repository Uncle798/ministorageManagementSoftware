<script lang="ts">
    import { page } from '$app/state';
	import Header from '$lib/Header.svelte';
</script>
<Header title={page.error?.message ? page.error.message : ''} />
<div class="mt-14 sm:mt-10 mx-1 sm:mx-2">
    <h1>{page.status}: {page.error?.message}</h1>
</div>