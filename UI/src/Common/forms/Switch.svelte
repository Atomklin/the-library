<script lang="ts">
  export let disabled: boolean = false;
  export let checked;
</script>


<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" bind:checked={checked} class="sr-only peer" {disabled}>
  <div class="bg-zinc-800 w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
  </div>
</label>