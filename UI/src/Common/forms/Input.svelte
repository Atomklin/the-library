<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let placeholder = "";
  export let label = "";
  export let value;

  const dispatch = createEventDispatcher();
</script>


<div class="flex flex-col w-full">
  {#if label.length}
    <p class="ml-2 mb-2 text-sm font-bold uppercase select-none">
      {label}
    </p>
  {/if}
  <span class="flex flex-col md:flex-row gap-2">
    <slot name="left" />
    <input 
      class="rounded-md border-1 border-solid block text-lg font-normal m-0 p-2 w-full" 
      on:change={() => dispatch("change", value)}
      placeholder={placeholder} 
      type="text"
      bind:value/>
    <slot name="right" />
  </span>  
</div>


<style>
  p { color: #8e9297; }
  input {
    transition: border-color 0.2s ease-in-out;
    background-color: rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.3);
    outline-style: none;
    color: #dcddde;
  }
  input:focus {
    border-color: #4768ff;
  }
</style>