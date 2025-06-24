<script lang="ts">
   import type { InputConstraint } from 'sveltekit-superforms';
   import type { MouseEventHandler } from 'svelte/elements';
   
   interface Props {
      value:string;
      label: string | undefined;
      errors: string[] | undefined;
      constraints: InputConstraint | undefined;
      placeholder:string | undefined;
      name: string | null | undefined;
      onclick?: MouseEventHandler<HTMLInputElement> | undefined; 
   }
   let { value = $bindable(), label, errors, constraints, placeholder='Password', name, onclick, ...others }:Props = $props()
</script>

<label>
   {#if label}<span>{label}</span><br />{/if}
   <input
      type="password"
      name={name}
      class="input"
      bind:value={value}
      aria-invalid={errors ? 'true' : undefined}
      placeholder={placeholder}
      autocomplete="new-password"
      onclick={onclick}
      {...constraints}
      {...others}
   />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}