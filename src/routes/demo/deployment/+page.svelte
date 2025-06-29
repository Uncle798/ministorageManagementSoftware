<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let mounted = $state(false);
    onMount(() => {
        mounted = true;
    })
</script>

<div class="mt-10">
    {#if !mounted}
        Starting deployment...
    {:else}
        Building deployment...
    {/if}
    {data.alias}
</div>