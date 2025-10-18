
<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { Toast, Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from './toaster';
	import { PUBLIC_COMPANY_NAME } from '$env/static/public';
	import { enhance } from '$app/forms';
	import '../app.css';
	import type { PageData } from './$types';
	import { CircleXIcon, Menu, XCircle } from 'lucide-svelte';

	interface Props {
		data: PageData,
		children: import('svelte').Snippet;
	}
	let { children, data }:Props = $props();
	interface Link {
		link: string;
		label: string;
	}
	let customerLinks:Link[] =[
		{link: '/', label: 'Home'},
		{link: '/about', label: 'About'}
	]
	let adminLinks:Link[] = [
		{link: '/users', label:'All Users'},
	]
	let menuOpen = $state(false);
	beforeNavigate(()=>{
		menuOpen = false
	});

</script>
<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
<header> 
	<Dialog
		open={menuOpen}
		onOpenChange={(e) => (menuOpen = e.open)}
	>
		<Dialog.Trigger class='btn bg-primary-50-950 hover:shadow-xl hover:border-2 border-secondary-50-950 fixed top-0 left-0 z-40 h-12 sm:h-8 rounded-tl-none mainMenuButton'>
			<Menu aria-label="Main Menu" />	
		</Dialog.Trigger>
		<Portal>
			<Dialog.Backdrop class="fixed inset-0 bg-surface-50-950/50 transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100" />
			<Dialog.Positioner class='fixed inset-0 z-40 flex justify-start rounded-none'>
				<Dialog.Content class="h-screen card bg-surface-100-900 w-[250px] p-4 space-y-4 shadow-xl transition transition-discrete opacity-0 -translate-x-full 
						starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0 rounded-l-none mainMenu">
					<header class='flex justify-between items-center'>
						<Dialog.Title class='font-bold text-2xl'>
							Main menu
						</Dialog.Title>
						<Dialog.CloseTrigger><CircleXIcon /></Dialog.CloseTrigger>
					</header>
					<article class="">
						<ul>
							{#each customerLinks as link}
								<li><a href={link.link} class="anchor">{link.label}</a></li>
							{/each}
							{#if data.user?.admin}
								{#each adminLinks as link}
									<li><a href={link.link} class="anchor">{link.label}</a></li>
								{/each}
							{/if}
							<div class="absolute bottom-0 m-1 sm:m-2 mb-2  bg-surface-100-900">
								{#if data.user}
									<form action="/logout" method="post" use:enhance>
										<li><button class="anchor" type="submit">Logout</button></li>
									</form>
								{:else}
									<li><a class="anchor" href="/login">Login</a></li>
								{/if}
							</div>
						</ul>			
					</article>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>
	<div class="bg-tertiary-50-950 fixed w-screen top-0 left-0 h-12 sm:h-8 text-center font-bold z-30 ">
		<div class="fixed top-0 left-[85px] w-[225px] sm:w-screen text-center sm:left-0 text-wrap">
			<a href="/" class="anchor">{PUBLIC_COMPANY_NAME}</a>
		</div>
	</div>
	</header>
{@render children()}
