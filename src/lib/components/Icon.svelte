<script>
  import { iconPaths } from './iconpaths.js';
  export let name = 'eye';
  export let title = "Eye";
</script>
<div class="icon" title={title}>
  <svg 
  class="icon"
  viewBox="0 0 24 24"
  fill-rule="evenodd"
	clip-rule="evenodd"
  >
  {#each iconPaths[name] as path}
  <path d={path}></path>
  {/each}
</svg>
</div>

<style>
  .icon {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
    transition: all 300ms ease-out;
    overflow: visible;
  }
</style>