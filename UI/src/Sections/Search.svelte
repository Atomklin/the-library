<script lang="ts">
  import Switch from "../Common/forms/Switch.svelte";
  import Button from "../Common/forms/Button.svelte";
  import Input from "../Common/forms/Input.svelte";
  import Modal from "../Common/Modal.svelte";
  import imgUrl from "../../static/logo.svg";
  import { search } from "../Data/api";
  import { onMount } from "svelte";
  
  import type { SearchResponse } from "../Data/types";
  export let results: Promise<SearchResponse> | SearchResponse;

  let showOptions = false;
  let safeSearch = true;
  let query: string;
  let args: string;

  onMount(() => args = localStorage.getItem("search-args"))
  const commonSvgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    class: "w-6 h-6",
    fill: "none"
  }

  function submitQuery() {
    if (query.length < 2) return;

    const options: Record<string, any> = {};
    const regex = /([a-zA-Z_]+)=([\w]+)/g;
    options.safeSearch = safeSearch;

    if (typeof args == "string" && args.length) {
      const matches = args.matchAll(regex);
      for (const match of matches) 
        options[match[1]] = match[2];
    }

    results = search(query, options);
  }
</script>


<!-- Search Bar -->
<div class="flex w-1/3 mx-auto pt-8 flex-col justify-center" style="min-width: 300px;">
  <img class="w-1/3 mb-4 mx-auto hidden md:block drop-shadow-xl" src={imgUrl} alt="logo"/>
  <Input placeholder="Search The Library..." 
    bind:value={query}
    on:change={submitQuery}
    label="The Library"> 
    <span slot="right" class="flex flex-row gap-2 justify-center">
      <Button disabled={typeof query != "string" || query.length < 3} on:click={submitQuery}>
        <svg {...commonSvgProps}>
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            stroke-linejoin="round" 
            stroke-linecap="round" 
            stroke-width="2" />
        </svg>
      </Button>
      <Button on:click={() => showOptions = true}>
        <svg {...commonSvgProps}>
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
{#if showOptions}
  <Modal bind:show={showOptions}>
    <p class="text-lg font-bold border-b uppercase select-none pb-4 w-96 mb-4">
      Search Options
    </p>
    <div class="flex flex-row justify-between p-0 mb-2 px-2">
      <p class="uppercase text-sm font-bold" style="color: #8e9297;">Safe Search</p>
      <Switch bind:checked={safeSearch}></Switch>
    </div>
    <Input on:change={() => localStorage.setItem("search-args", args)}
      placeholder="key=value; foo=bar..." 
      label="Additional Server args"
      bind:value={args} />
  </Modal>
{/if}
