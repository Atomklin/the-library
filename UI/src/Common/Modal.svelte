<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  
  const dispatch = createEventDispatcher();
</script>


<svelte:window on:keydown={(e) => { if (e.key == "Escape") dispatch("escape"); }}/>

<div out:fade={{ duration: 200 }} tabindex="-1" class="fixed top-0 left-0 right-0 w-full overflow-x-hidden overflow-y-auto z-30">
  <div class="flex items-center justify-center min-h-screen">
    <!-- Background -->
    <div on:click={() => dispatch("escape")}
      class="fixed z-40 inset-0 transition-opacity bg-black opacity-75" 
      aria-hidden="true" />

    <!-- Foreground -->
    <div class="foreground z-50 rounded-lg shadow-xl px-4 py-5 w-full md:w-fit">
      <slot />
    </div>
  </div>
</div>


<style>
  .foreground { background-color: #36393f; }
</style>

