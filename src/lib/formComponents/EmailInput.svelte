<script lang="ts">
   import type { InputConstraint } from 'sveltekit-superforms';
   
   interface Props {
      value:string;
      label: string | undefined;
      errors: string[] | undefined;
      constraints: InputConstraint | undefined;
      placeholder?:string | undefined;
      name: string | null | undefined
   }
   let { value = $bindable(), label, errors, constraints, placeholder='email@email.com', name, ...others }:Props = $props()
</script>
<label>
   {#if label}<span class="label-text">{label}</span>{/if}
   <input
      type="email"
      name={name}
      class="input truncate"
      bind:value={value}
      aria-invalid={errors ? 'true' : undefined}
      placeholder={placeholder}
      autocomplete="email"
      {...constraints}
      {...others}
   />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}

