<script>
  import { obs, sceneList, currentScene, previewScene } from '../../services/obs.service.js';
  import { connectionService } from '../../machines/connection.machine.js';
  import SceneCard from '../SceneCard.svelte';
  /**
   * What's in a scene?
   * name: String
   * sources: Array
  */
</script>
<section class="scene-panel">

  {#if $connectionService.matches('connected')}
    {#each $sceneList as scene}
      <SceneCard {scene} />
    {/each}
  {/if}
</section>

<style>
  .scene-panel {
    padding: 1rem;
	}
  :global(.scene-panel > * + *) {
    margin-top: 1rem;
  }
</style>