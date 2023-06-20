<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let active: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<button class="{active ? "active" : ""} radio flex items-center w-full p-3 rounded select-none"
  on:click={() => dispatch("click")}>
  <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24" class="w-4 h-4 mr-2">
    <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      fill-rule="evenodd"
      clip-rule="evenodd"
      fill="currentColor">
    </path>
    <circle cx="12" cy="12" r="5" class="fill-transparent">
    </circle>
  </svg>
  <slot />
</button>

<style>
  .radio { background-color: #2f3136; }
  .radio:hover { background-color: rgba(116, 127, 141, 0.1); }
  .radio.active { background-color: #202225; }
  .radio.active circle { fill: #4768ff; }
</style>

