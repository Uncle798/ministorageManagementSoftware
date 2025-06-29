<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { User } from '@prisma/client';

	interface Props {
		user: User;
		classes?: string;
	}
	let { user, classes }: Props = $props();
	async function deleteUser(userId:string) {
		await fetch('/api/users', {
			method: 'DELETE',
			body: JSON.stringify({userId})
		})
		invalidateAll();
	}
</script>

<div class="{classes}">
	<div><a href="/users/{user.id}" class="anchor">{user.givenName} {user.familyName}</a></div>
	<div>{user.companyName}</div>
	<div class="truncate"><a href="mailto:{user.email}" class="anchor">{user.email}</a></div>
	<button class="btn preset-filled-primary-50-950 m-1" onclick={()=> deleteUser(user.id)}>Delete User</button>
	<button class="btn preset-filled-primary-50-950 m-1" onclick={()=> goto('/demo')}>New Demo</button>
</div>
