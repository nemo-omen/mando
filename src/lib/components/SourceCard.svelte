<script>
  import { onMount, afterUpdate } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { obs, sourceTypeNames } from '../services/obs.service.js';
  import Icon from './Icon.svelte';

  export let source;

  $:displayName = "";

  function getDisplayName() {
    displayName = $sourceTypeNames.filter((sourceType) => {
      return sourceType.name === source.type;
    })[0].displayName;
  }
  
  onMount(async () => {
    getDisplayName();
    // console.log(displayName);
  });
  
  afterUpdate(() => {
    getDisplayName();
  });
</script>

<article 
  class="source-card"
  >
  <h3 transition:fly={{x: 2000, duration: 300, easing: quintInOut}}>{displayName}</h3>
  <div class="icon">
    <Icon name="{source.type}" />
  </div>
</article>

<style>
  .source-card {
    border: 1px solid var(--secondary-dark);
    transition: all 300ms ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }
  .source-card:hover {
    background-color: var(--blackish-light);
    border-color: var(--secondary-darker);
  }
  .source-card:active {
    background-color: var(--blackish-lighter);
  }
</style>