<script>
  import { previewScene } from '../../services/obs.service.js';

  console.log("Selected scene sources", $previewScene.sources);
</script>

{#each $previewScene.sources as source}
  <p>{source.name}</p>
{/each}