<script lang='ts'>
   import type { InputConstraint } from "sveltekit-superforms";
   interface Props {
      value: string | undefined;
      label: string | undefined;
      errors: string[] | undefined;
      constraints: InputConstraint | undefined;
      groupName: string | null | undefined;
      id: string | undefined;
      classes?: string;
   }
   let { value = $bindable(), label, errors, constraints, groupName, id, classes }:Props = $props();
</script>
<div class="flex mx-2 justify-items-center {classes}">
   <label for={id}><span class="label-text text-center">{label}</span>
   <input
      type="radio"
      name={groupName}
      id={id}
      class="radio justify-self-center"
      bind:value={value}
      {...constraints}
   />
   </label>
   {#if errors}
      <span class="invalid">{errors}</span>
   {/if}
</div>