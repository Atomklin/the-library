<script lang="ts">
  import Modal from "../../Common/Modal.svelte";
  import Input from "../../Common/forms/Input.svelte";

  import { visibleModal } from "../../Data/stores";
  export let args: string;
</script>


{#if $visibleModal == "search-options"} 
  <Modal on:escape={() => visibleModal.set(undefined)}>
    <p class="text-lg font-bold border-b uppercase select-none pb-4 w-96 mb-4">
      Search Options
    </p>
    <Input on:change={() => localStorage.setItem("search-options", args)}
      placeholder="key=value; foo=bar..." 
      label="Additional Search Args" 
      bind:value={args} />
  </Modal>
{/if}
