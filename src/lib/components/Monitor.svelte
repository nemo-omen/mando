<script>
  import { onMount } from 'svelte';
  import { currentScene, previewScene, obs } from '../services/obs.service.js';
  import { programService } from '../machines/program.machine.js';
  import { previewService } from '../machines/preview.machine.js';
  import { studioModeService } from '../machines/studiomode.machine.js';
  import { previewScreenshot, programScreenshot } from '../services/obs.service.js';
  export let role;

  $:sceneTitle = role === 'preview' ? $previewScene.name : $currentScene.name;

  onMount(() => {
    programService.send('POLL');
    previewService.send('POLL');
  });

  studioModeService.onTransition((state) => {
    if(state.value === 'program' && $previewService.matches('active')) {
      previewService.send('STOP_POLLING');
    } else if(state.value === 'studio' && $previewService.matches('idle')) {
      previewService.send('POLL');
    }
  });
</script>

<div class="monitor">
  <svg viewBox="0 0 640 360" fill-rule="evenodd" clip-rule="evenodd">
    <rect width="640" height="360"></rect>
  </svg>

  {#if role === 'preview'}
    {#if $previewService.matches('active')}
    <img src={$previewScreenshot} alt={sceneTitle === undefined ? '' : sceneTitle} class="screenshot" />
    {/if}
  {:else}
    {#if $programService.matches('active')}
    <img src={$programScreenshot} alt={sceneTitle === undefined ? '' : sceneTitle} class="screenshot" />
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>