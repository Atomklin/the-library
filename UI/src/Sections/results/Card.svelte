<script lang="ts">
  import { ItemType, type Result } from "../../Data/types";
  import { selected } from "../../Data/stores"
  
  export let result: Result;

  const { name, thumbnail, description, type } = result;
</script>




<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card cursor-pointer overflow-hidden select-none rounded-lg px-3 py-5 grid grid-cols-1 xl:grid-cols-3 gap-1 xl:gap-4" 
  on:click={() => selected.set(result)}>
  <div class="image-container rounded-md overflow-hidden hover:scale-105 bg-black shrink-0">
    <img src={thumbnail ?? "https://placehold.co/274x154/png?text=" + result.name.replace(/ +/g, "+")} 
      class="w-full h-full object-scale-down"   
      decoding="auto"
      alt={name}> 
  </div>
  <div class="flex w-full pr-2 flex-col justify-between duration-500 xl:col-span-2 gap-2">
    <div>
      <h1 class="text-lg font-semibold text-white">
        {name}
      </h1> 
      <p class="text-zinc-400 hidden xl:block">
        {description ?? "No file descriptions."}
      </p>
    </div>
    <div class="flex gap-1 mt-2 md:mt-0">
      {#if type == ItemType.Group}
        <div class="tag bg-rose-700">
          Collection
        </div>
      {:else if type == ItemType.Video}
        <div class="tag bg-fuchsia-700">
          Video
        </div>
      {:else if type == ItemType.Audio}
        <div class="tag bg-purple-700">
          Audio
        </div>
      {:else if type == ItemType.Image}
        <div class="tag bg-indigo-700">
          Image
        </div>
      {:else}
        <div class="tag bg-zinc-700">
          Unknown
        </div>
      {/if}
    </div>
  </div>
</div>


<style>  
  .card { 
    transition: background-color ease 0.2s;
    background-color: #2f3136;
  }
  .card:hover {
    background-color: #202225;
  }
  .image-container {
    height: 154px
  }
  .tag {
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }
</style>