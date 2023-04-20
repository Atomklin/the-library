<script lang="ts">
  let classNames = "";
  export let style = "";
  export { classNames as class };
</script>


<p class="{classNames} text-sm font-bold uppercase select-none" {style}>
  <slot />
</p>


<style>
  p { color: #8e9297; }
</style>