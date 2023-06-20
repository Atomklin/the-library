<script lang="ts">
  import { fade } from "svelte/transition";
  
  import Button from "../../Common/forms/Button.svelte";
  import Input from "../../Common/forms/Input.svelte";
  import OptionsModal from "./OptionsModal.svelte";
  import imgUrl from "../../../static/logo.svg";

  import type { ItemType, SearchResponse } from "../../Data/types";
  import { search } from "../../Data/api";
  
  export let results: Promise<SearchResponse> | SearchResponse;

  let isOptionsVisible: boolean;

  let blacklist = new Set<ItemType>();
  let safeSearch = true;
  let query: string;
  
  function submit() { 
    if (query.length < 3) return;
    results = search({ query, safeSearch, blacklist });
  };
</script>


<!-- Search Bar -->
<div class="flex w-72 md:w-1/3 mx-auto pt-8 flex-col justify-center">
  {#if !results}
    <img class="md:mt-56 mb-6 mx-auto drop-shadow-xl w-80" 
      out:fade={{ duration: 150 }}
      src={imgUrl} 
      alt="logo"/>
  {/if}
  <Input placeholder="Search The Library..." 
    on:submit={submit}
    bind:value={query}
    label="The Library"> 
    <span slot="right" class="flex flex-row gap-2 justify-center">
      <Button disabled={typeof query != "string" || query.length < 3} on:click={submit}>
        <svg xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          viewBox="0 0 24 24"
          class="w-6 h-6"
          fill="none">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            stroke-linejoin="round" 
            stroke-linecap="round" 
            stroke-width="2" />
        </svg>
      </Button>
      <Button on:click={() => isOptionsVisible = true}>
        <svg xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          viewBox="0 0 24 24"
          class="w-6 h-6"
          fill="none">
          <path d="M9.74292939,13.7429294 C9.19135019,13.9101088 8.60617271,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,7.07370693 2.20990431,6.19643964 2.58474197,5.4131691 L6.94974747,9.77817459 L9.77817459,6.94974747 L5.4131691,2.58474197 C6.19643964,2.20990431 7.07370693,2 8,2 C11.3137085,2 14,4.6862915 14,8 C14,8.88040772 13.8103765,9.71652648 13.4697429,10.4697429 L20.5858636,17.5858636 C21.3669122,18.3669122 21.3669122,19.6332422 20.5858636,20.4142907 L19.9142907,21.0858636 C19.1332422,21.8669122 17.8669122,21.8669122 17.0858636,21.0858636 L9.74292939,13.7429294 Z" 
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2" />
        </svg>
      </Button>
    </span>
  </Input>
</div>

<!-- Search Options Modal -->
<OptionsModal bind:visible={isOptionsVisible} 
  bind:safeSearch 
  bind:blacklist/>