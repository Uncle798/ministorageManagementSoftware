<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { Toaster, Modal } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from './toaster';
	import { XCircleIcon, Menu } from 'lucide-svelte';
	import { PUBLIC_COMPANY_NAME } from '$env/static/public';
	import { enhance } from '$app/forms';
	import '../app.css';
	import type { PageData } from './$types';

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
	]
	let adminLinks:Link[] = [
		{link: '/users', label:'All Users'},
	]
	let menuOpen = $state(false);
	beforeNavigate(()=>{
		menuOpen = false
	});

</script>
<Toaster {toaster} ></Toaster>
<header> 
		<Modal
			open={menuOpen}
			onOpenChange={(e) => (menuOpen = e.open)}
			triggerBase="btn bg-primary-50-950 hover:shadow-xl hover:border-2 border-secondary-50-950 fixed top-0 left-0 z-50"
			contentBase="bg-surface-100-900 p-2 space-y-2 shadow-xl w-[125px] h-screen"
			positionerJustify="justify-start"
			positionerAlign=""
			positionerPadding=""
			transitionsPositionerIn={{ x: -280, duration: 400 }}
			transitionsPositionerOut={{ x: -280, duration: 400 }}
		>
		{#snippet trigger()}
			<Menu class='mx-2 border-2 z-50' aria-label='Main Menu'/>	
		{/snippet}
		{#snippet content()}
			<article class="">
				<button class="absolute top-1 left-[90px] btn-icon" onclick={()=>{menuOpen=false}}><XCircleIcon aria-label='close' class=''/></button>
				<ul>
					{#each customerLinks as link}
						<a href={link.link} class="anchor">{link.label}</a>
					{/each}
					<div class="absolute bottom-0 m-1 sm:m-2 mb-2  bg-surface-100-900">
						{#if data.user}
						<li><a href="/accountSettings" class="anchor">Settings</a></li>
							<form action="/logout" method="post" use:enhance>
								<li><button class="anchor" type="submit">Logout</button></li>
							</form>
						{:else}
							<li><a class="anchor" href="/login">Login</a></li>
						{/if}
					</div>
				</ul>
				
			</article>
		{/snippet}
		</Modal>
		<div class="bg-tertiary-50-950 fixed w-screen top-0 left-0 h-9 text-center font-bold z-40 "><a href="/" class="anchor">{PUBLIC_COMPANY_NAME}</a></div>
	</header>
{@render children()}
