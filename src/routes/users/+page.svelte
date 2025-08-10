<script lang="ts">
	import UserAdmin from '$lib/displayComponents/UserAdmin.svelte';
   import type { PageData } from './$types';
	import Header from '$lib/Header.svelte';

   let { data }: { data: PageData } = $props();

</script>
<Header title='All users' />
{#await data.usersPromise}
   <div class="mt-14 sm:mt-10">Loading users...</div>
{:then users}
   <div class="mt-14 sm:mt-10 flex flex-col gap-2 mx-2">
      {#each users as user }
         <div class='border border-primary-50-950 rounded-lg'>
            <UserAdmin {user} classes='m-2' />
         </div>
      {/each}
   </div>
{/await}