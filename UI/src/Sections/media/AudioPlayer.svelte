<script lang="ts">
  import Modal from "../../Common/Modal.svelte";
    
  import { selected } from "../../Data/stores";
</script>


<Modal on:escape={() => selected.set(undefined)}>
  <canvas width="1920" height="1080" id="audio-canvas">
  </canvas>
</Modal>