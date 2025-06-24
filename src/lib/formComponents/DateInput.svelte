<script lang="ts">
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import type { InputConstraint } from 'sveltekit-superforms';
	dayjs.extend(utc);
	interface Props {
		value: Date | undefined;
		label: string | undefined;
		errors: string[] | undefined;
		constraints: InputConstraint | undefined;
		placeholder?: string | undefined;
		name: string | null | undefined;
		min: Date | undefined;
		max: Date | undefined;
	}
	let {
		value = $bindable(),
		label,
		errors,
		constraints,
		placeholder,
		name,
		min,
		max,
		...others
	}: Props = $props();
</script>

<div class="mb-2 ">
	<label class="label">
		{#if label}<span class="label-text">{label}</span>{/if}
		<input
			type="date"
			class="input"
			{name}
			bind:value
			aria-invalid={errors ? 'true' : undefined}
			{placeholder}
			min={dayjs.utc(min).format('YYYY-MM-DD')}
			max={dayjs.utc(max).format('YYYY-MM-DD')}
			{...constraints}
			{...others}
		/>
	</label>
	{#if errors}<span class="invalid">{errors}</span>{/if}
</div>
