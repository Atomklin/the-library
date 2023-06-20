<script lang="ts">
  import type { SearchResponse } from "./Data/types";
  
  import Results from "./Sections/results/Results.svelte";
  import SearchBar from "./Sections/search/SearchBar.svelte";
  import Medias from "./Sections/media/Medias.svelte"
  
  let results: Promise<SearchResponse> | SearchResponse;
</script>


<main>
  <Medias />
  <SearchBar bind:results />
  {#if results}
    <Results {results} />
  {/if}
</main>