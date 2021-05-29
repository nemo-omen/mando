<script>
  import { fade, fly, slide } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { previewScene, currentScene } from '../../services/obs.service.js';
  import { connectionService } from '../../machines/connection.machine.js';
  import { studioModeService } from '../../machines/studiomode.machine.js';
  import SourceCard from '../SourceCard.svelte';
</script>
<section class="source-panel">
  {#if $studioModeService.matches('studio')}
    {#if $connectionService.matches('connected') && $previewScene.sources !== null && $previewScene.sources !== undefined}
      {#each $previewScene.sources as source}
        <div>
          <SourceCard {source} />
        </div>
      {/each}
    {/if}
  {:else}
    {#if $connectionService.matches('connected') && $currentScene.sources !== null && $currentScene.sources !== undefined}
      {#each $currentScene.sources as source}
        <div>
          <SourceCard {source} />
        </div>
      {/each}
    {/if}
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