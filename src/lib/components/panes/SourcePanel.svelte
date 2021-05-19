<script>
  import { fade, fly, slide } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { previewScene } from '../../services/obs.service.js';
  import { connectionService } from '../../machines/connection.machine.js';
  import SourceCard from '../SourceCard.svelte';
</script>
<section class="source-panel">

  {#if $connectionService.matches('connected') && $previewScene.sources !== null && $previewScene.sources !== undefined}
  {#each $previewScene.sources as source}
  <div transition:fly={{y: 2000, duration: 600, easing: quintInOut}}>
    <SourceCard {source} />
  </div>
  {/each}
  {/if}
</section>

<style>
  .source-panel {
    padding: 0.5rem;
  }
  .source-panel > * + * {
    margin-top: 0.5rem;
  }
</style>