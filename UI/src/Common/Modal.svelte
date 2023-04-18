<script lang="ts">
  export let preventClosure: boolean = false;
  export let show: boolean;
</script>

<div tabindex="-1" class=" fixed top-0 left-0 right-0 w-full overflow-x-hidden overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen">
    <!-- Background -->
    <div on:click={() => { if (!preventClosure) show = false }}
      class="fixed z-40 inset-0 transition-opacity bg-black opacity-75" 
      aria-hidden="true" />

    <!-- Foreground -->
    <div class="z-50 rounded-lg shadow-xl px-4 py-5 w-full md:w-fit" style="background-color: #36393f;">
      <slot></slot>
    </div>
  </div>
</div>