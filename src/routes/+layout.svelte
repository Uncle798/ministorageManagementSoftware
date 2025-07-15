
<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { Toaster, Modal } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from './toaster';
	import { PUBLIC_COMPANY_NAME } from '$env/static/public';
	import { enhance } from '$app/forms';
	import '../app.css';
	import type { PageData } from './$types';
	import { Menu, XCircle } from 'lucide-svelte';

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
			transitionsPositionerIn={{ x: -125, duration: 400 }}
			transitionsPositionerOut={{ x: -125, duration: 400 }}
		>
		{#snippet trigger()}
			<Menu aria-label="Main Menu" class='h-12 sm:h-auto'/>	
		{/snippet}
		{#snippet content()}
			<article class="">
				<button class="absolute top-1 left-[80px] btn-icon" onclick={()=>{menuOpen=false}}><XCircle aria-label="Close"/> </button>
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
		{/snippet}
		</Modal>
		<div class="bg-tertiary-50-950 fixed w-screen top-0 left-0 h-12 sm:h-9 text-center font-bold z-30 ">
			<div class="fixed top-0 left-[85px] w-[225px] sm:w-screen text-center sm:left-0 text-wrap">
				<a href="/" class="anchor">{PUBLIC_COMPANY_NAME}</a>
			</div>
		</div>
	</header>
{@render children()}
