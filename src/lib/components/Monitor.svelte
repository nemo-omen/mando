<script>
  import { onMount } from 'svelte';
  import { currentScene, previewScene, obs } from '../services/obs.service.js';
  import { monitorService } from '../machines/monitor.machine.js';
  import { previewScreenshot, programScreenshot } from '../services/obs.service.js';
  export let role;

  $:sceneTitle = role === 'preview' ? $previewScene.name : $currentScene.name;

  onMount(() => {
    monitorService.send({
      role,
      type: 'POLL', 
      sourceName: sceneTitle
    });
  });

  monitorService.onTransition((state) => {
    console.log('MonitorMachine state: ', state.value);
  });
</script>

<div class="monitor">
  <svg viewBox="0 0 1920 1080" fill-rule="evenodd" clip-rule="evenodd">
    <rect width="1920" height="1080"></rect>
  </svg>
  {#if $monitorService.matches('active')}
  {#if role === 'preview'}
  <img src={$previewScreenshot} alt={sceneTitle === undefined ? '' : sceneTitle} class="screenshot" width="640" height="360" />
  {:else}
  <img src={$programScreenshot} alt={sceneTitle === undefined ? '' : sceneTitle} class="screenshot" width="640" height="360" />
  {/if}
  {/if}
</div>

<h3 class="monitor-title">{sceneTitle === undefined ? '' : sceneTitle}</h3>

<style>
  .monitor {
    position: relative;
    color: var(--blackish-darker);
    background-color: var(--blackish-darker);
    aspect-ratio: 16 / 9;
    fill: currentColor;
    max-height: 45vh;
  }
  .monitor-title {
    margin-top: 1rem;
    text-align: center;
  }
  .screenshot {
    min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>