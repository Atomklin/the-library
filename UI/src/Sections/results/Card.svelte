<script lang="ts">
  import type { Item } from "../../Data/types";
  export let result: Item;

  const data = result;  
  const thumbnail = data.type != "Image" 
    ? data.thumbnail ?? "https://placehold.co/274x154/png"
    : data.location;
</script>


<div class="card cursor-pointer overflow-hidden select-none rounded-lg px-3 py-5 flex flex-col lg:flex-row gap-1 lg:gap-4">
  <div class="image-container rounded-md overflow-hidden hover:scale-105 bg-black shrink-0">
    <img decoding="auto" class="w-full h-full object-contain" src={thumbnail} alt={data.name}>
  </div>
  <div class="flex w-full pr-2 flex-col justify-between duration-500">
    <div>
      <h1 class="text-lg font-semibold text-white">
        {data.name}
      </h1> 
      <p class="text-zinc-400 hidden md:block">
        {data.description ?? "No file descriptions."}
      </p>
    </div>
    <div class="flex gap-1 mt-2 md:mt-0">
      <div class="type rounded-lg px-2 py-1 text-ts text-xs bg-zinc-700">
        {data.type}
      </div>
      {#each data.tags as tag}
        <div class="tag rounded-lg px-2 py-1 text-xs">
          {tag}
        </div>
      {/each}
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
    height: 154px;
    width: min(274px, 100%);
  }
  .tag {
    background-color: rgb(33, 33, 33);
  }
</style>