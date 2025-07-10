<script lang="ts">
	import { page } from '$app/state';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="mt-14 sm:mt-10">
    ...loading
    {#if page.error}
        {page.error.message}
    {/if}
</div>
