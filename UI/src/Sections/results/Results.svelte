<script lang="ts">
  import Error from "../../Common/typography/Error.svelte";
  import Label from "../../Common/typography/Label.svelte";
  import Loading from "../../Common/Loading.svelte";
  import Card from "./Card.svelte";

  import type { SearchResponse } from "../../Data/types";

  export let results: Promise<SearchResponse> | SearchResponse;
</script>

<div class="flex flex-col w-72 md:w-1/3 mx-auto mt-16">
  <Label class="w-full border-b pb-2 pl-2 mb-4" style="border-color: #8e9297;">
    The Results
  </Label>
  {#await results}
    <Loading />
  {:then results} 
    {#if results.length}
      <div class="flex flex-col gap-3">
        {#each results as result (result.id)}
          <Card {result} />    
        {/each}    
      </div>
    {:else}
      <!-- No results -->
      <!-- @todo -->
    {/if}
  {:catch error}
    <Error class="mx-4">
      <b>Error: </b>
      {error.message}
    </Error>
  {/await}
</div>