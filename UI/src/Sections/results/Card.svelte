<script lang="ts">
  import type { Result } from "../../Data/types";
  export let result: Result;

  const data = result;
  const tags = [data.type, ...data.tags.slice(0, 5)];
  const concatString = (str: string, max: number) =>
    str.length > max 
      ? str.slice(0, max - 3) + "..." 
      : str;
</script>


<div class="card cursor-pointer overflow-hidden select-none rounded-lg px-3 py-5 flex flex-col lg:flex-row gap-1 lg:gap-4">
  <span class="image-container rounded-md overflow-hidden hover:scale-105 bg-black shrink-0">
    <img class="w-full h-full object-contain" src={data.thumbnail} alt={data.title}>
  </span>
  <div class="flex w-full pr-2 flex-col justify-between duration-500">
    <span>
      <h1 class="text-lg font-semibold text-white">
        {concatString(data.title, 50)}
      </h1> 
      <p class="text-zinc-400 hidden md:block">
        {concatString(data.description, 150)}
      </p>
    </span>
    <span class="flex gap-1 mt-2 md:mt-0">
      {#each tags as tag}
        <span class="tag rounded-lg px-2 py-1 text-xs">
          {tag}
        </span>
      {/each}
    </span>
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