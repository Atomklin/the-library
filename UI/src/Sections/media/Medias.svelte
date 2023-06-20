<script lang="ts">
  import AudioPlayer from "./AudioPlayer.svelte";
  import VideoPlayer from "./VideoPlayer.svelte";
  
  import { selected } from "../../Data/stores";
  import { ItemType } from "../../Data/types";
</script>

{#if $selected}
  {#if $selected.type == ItemType.Video}
    <VideoPlayer />
  {:else if $selected.type == ItemType.Audio}
    <AudioPlayer />
  {/if}
{/if}