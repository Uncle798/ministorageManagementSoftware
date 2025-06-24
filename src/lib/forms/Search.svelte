<script lang="ts">
	import type { SearchFormSchema } from '$lib/formSchemas/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	interface Props {
		data: SuperValidated<Infer<SearchFormSchema>>;
		search: string;
		searchType: string;
		classes?: string;
	}
	let { data, search = $bindable(''), searchType, classes }: Props = $props();
	let { form, enhance } = superForm(data, {
		onChange(event) {
			search = event.get('search');
		}
	});
</script>

<div class="{classes}">
	<form method="POST" use:enhance>
		<label class="label-text"
			>Search by {searchType}
			<input
				type="search"
				name="search"
				id="search"
				class="input"
				placeholder="Search by {searchType}..."
				bind:value={search}
			/>
			<button
				class="btn rounded-lg preset-filled-primary-50-950 my-1"
				type="button"
				onclick={() => {
					$form.search = '';
					search = '';
				}}>Clear search</button
			>
		</label>
	</form>
</div>
