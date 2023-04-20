<script lang="ts">
  import type { SearchResponse } from "./Data/types";
  
  import Results from "./Sections/results/Results.svelte";
  import Search from "./Sections/Search.svelte";
  
  let results: Promise<SearchResponse> | SearchResponse;
</script>


<main>
  <Search bind:results />
  {#if results}
    <Results {results} />
  {/if}
</main>