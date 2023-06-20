<script lang="ts">
  import Modal from "../../Common/Modal.svelte";
  import { selected } from "../../Data/stores";

  const { name, path } = $selected;
</script>

<Modal on:escape={() => selected.set(undefined)}>
  <p class="text-lg font-bold border-b uppercase select-none pb-4 mb-4">
    { name }
  </p>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video src={path} controls>
  </video>
</Modal>  