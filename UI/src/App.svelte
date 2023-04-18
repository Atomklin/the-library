<script lang="ts">
  import type { SearchResponse } from "./Data/types";
  import Search from "./Sections/Search.svelte";

  let results: Promise<SearchResponse> | SearchResponse;
</script>


<main>
  <Search bind:results />
</main>