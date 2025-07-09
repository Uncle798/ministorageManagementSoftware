<script lang="ts">
	import { source } from 'sveltekit-sse';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();
   const message = source('/api/destroyDemo').select('message');
</script>

<div class="mt-10 mx-2">
   Message: {$message}
</div>