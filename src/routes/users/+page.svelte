<script lang="ts">
	import UserAdmin from '$lib/displayComponents/UserAdmin.svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();
   let descriptionModalOpen = $state(true)

</script>
{#await data.usersPromise}
   <div class="mt-14 sm:mt-10">Loading users...</div>
{:then users}
   <Modal
   
   >
   </Modal>
   <div class="mt-14 sm:mt-10 flex flex-col gap-2 mx-2">
      {#each users as user }
         <div class='border border-primary-50-950 rounded-lg'>
            <UserAdmin {user} classes='m-2' />
         </div>
      {/each}
   </div>
{/await}
visited 