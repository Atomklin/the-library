<script lang="ts">
  import { onMount } from "svelte";

  import CloseIcon from "../../Common/icons/Close.svelte";
  import Switch from "../../Common/forms/Switch.svelte";
  import Radio from "../../Common/forms/Radio.svelte";
  import Modal from "../../Common/Modal.svelte";
  
  import { ItemType } from "../../Data/types";
 
  export let visible: boolean;
  export let safeSearch: boolean;
  export let blacklist: Set<ItemType>;

  const onClose = () => {
    visible = false
    localStorage.setItem("search-options", JSON.stringify({
      blacklist: [...blacklist.values()],
      safeSearch
    }))    
  };

  const toggleItem = (item: ItemType) => {
    blacklist.has(item) 
      ? blacklist.delete(item)
      : blacklist.add(item)

    // Redeclare it so it updates
    blacklist = new Set<ItemType>(blacklist.values())
  }

  onMount(() => {
    const json = JSON.parse(localStorage.getItem("search-options"));
    if (json) {
      blacklist = new Set(json.blacklist);
      safeSearch = json.safeSearch;
    }
  })
</script>


{#if visible} 
  <Modal on:escape={onClose}>
    <div class="flex justify-between border-b mb-4">
      <p class="text-lg font-bold uppercase select-none pb-2  text-zinc-200">
        Search Options
      </p>
      <button class="h-6" on:click={onClose}>
        <CloseIcon />
      </button>
    </div>

    <div class="flex flex-col mx-4 gap-2">
      <div class="flex justify-between gap-20">
        <span class="flex flex-col">
          <p class="font-bold text-zinc-400 uppercase text-sm">
            Safe Search
          </p>
          <p class="text-zinc-500 text-sm pl-2">
            Omit results that contains NSFW content.
          </p>
        </span>
        <span class="flex items-center">
          <Switch bind:checked={safeSearch}/>
        </span>
      </div>
      <span class="flex flex-col">
        <p class="font-bold text-zinc-400 uppercase text-sm">
          Blacklist
        </p>
        <p class="text-zinc-500 text-sm pl-2 ">
          Omit results that have the following type(s).
        </p>
      </span>
      <div class="grid grid-cols-2 gap-1">
        {#each ["Unknown", "Group", "Video", "Audio", "Image"] as type }
          <Radio on:click={() => toggleItem(ItemType[type])} 
            active={ blacklist.has(ItemType[type]) }>
            <p class="text-zinc-400 text-sm">
              {type}s
            </p>
          </Radio>
        {/each}
      </div>
    </div>
  </Modal>
{/if}
