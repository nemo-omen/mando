<script>
  import { previewScene } from '../../services/obs.service.js';
  import { connectionService } from '../../machines/connection.machine.js';
  import { fly } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  // console.log("Selected scene sources", $previewScene.sources);
</script>
{#if $connectionService.matches('connected') && $previewScene.sources !== null && $previewScene.sources !== undefined}
  {#each $previewScene.sources as source}
    <article class="source-card" in:fly={{y: 2000, duration: 300, delay: 300, easing: quintInOut}} out:fly={{y: 2000, duration: 200, easing: quintInOut}}>
      <p>{source.name}</p>
    </article>
  {/each}
{/if}