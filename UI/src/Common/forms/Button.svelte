<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type ButtonTheme = 
    "secondary" | 
    "success" | 
    "primary" | 
    "warning" |
    "danger" | 
    "link";

  export let theme: ButtonTheme = "primary";
  export let disabled = false;

  const dispatch = createEventDispatcher();
</script>


<button class="{theme} border-0 rounded py-1 px-4 cursor-pointer font-medium text-base flex justify-center items-center active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
  on:click={(e) => { if (!disabled) dispatch("click", e) }}
  {disabled}>
  <slot />
</button>


<style>
  button:focus { outline: none; }
  button {
    min-height: 32px;
    min-width: 60px;
    color: #dcddde;
    transition: 
      border-color 0.17s ease, 
      background-color 0.17s ease, 
      color 0.17s ease;
  }

  .primary { background-color: #4768ff; }
  .primary:hover { background-color: #677bc4; }
  .primary:active { background-color: #5b6eae; }

  .secondary { background-color: #747f8d; }
  .secondary:hover { background-color: #68727f; }
  .secondary:active { background-color: #5d6671; }

  .danger { background-color: #ff3a3b; }
  .danger:hover { background-color: #d84040; }
  .danger:active { background-color: #c03939; }

  .success { background-color: #38e654; color: #8a8a8a; }
  .success:hover { background-color: #3ca374; }
  .success:active { background-color: #35976b; }

  .warning { background-color: #faa61a; }
  .warning:hover { background-color: #c47d02; }
  .warning:active { background-color: #faa61a; }

  .link { background-color: transparent; }
  .link:focus { text-decoration: underline; }
</style>
