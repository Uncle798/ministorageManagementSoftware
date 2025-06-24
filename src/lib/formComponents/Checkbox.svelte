<script lang="ts">
   import type { InputConstraint } from "sveltekit-superforms";
   interface Props {
      value:boolean | undefined;
      label: string | undefined;
      errors: string[] | undefined;
      constraints: InputConstraint | undefined;
      name: string | null | undefined
   }
   let { value = $bindable(), label, errors, constraints, name, ...others }:Props = $props()
</script>
<label for="checkbox" class="label"><span class="label-text">{label}</span>
      <input 
         type="checkbox" 
         name={name} 
         class="checkbox" 
         bind:checked={value}
         aria-invalid={errors ? 'true' : undefined}
         {...constraints}
         {...others}
      />
</label>
{#if errors}<span class="invalid">{errors}</span>{/if}