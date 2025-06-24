<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';
   import type { InputConstraint } from 'sveltekit-superforms';
   
   interface Props {
      value:string | undefined | null;
      label: string | undefined;
      errors: string[] | undefined;
      constraints: InputConstraint | undefined;
      placeholder?:string | undefined;
      name: string | null | undefined;
      autocomplete?: FullAutoFill;
      classes?: string;
      rows?: number | null;
   }
   let { value = $bindable(), label, errors, constraints, placeholder, name, autocomplete, rows, ...others }:Props = $props()
</script>
<div class="">
   
   <label class="label ">
      {#if label}
         <span class="label-text">{label}</span>
      {/if}
      <textarea
         class="input rounded-none h-auto"
         rows={rows}
         name={name}
         bind:value={value}
         aria-invalid={errors ? 'true' : undefined}
         placeholder={placeholder}
         autocomplete={autocomplete}
         {...constraints}
         {...others}
      >
         {value}
      </textarea>
   </label>
   {#if errors}<span class="invalid">{errors}</span>{/if}
</div>