<script>
  import { onMount } from 'svelte';
  import { currentScene, previewScene, obs } from '../services/obs.service.js';
  export let role;

  $:sceneTitle = role === 'preview' ? $previewScene.name : $currentScene.name;
</script>

<div class="monitor">
  <svg viewBox="0 0 1920 1080" fill-rule="evenodd" clip-rule="evenodd">
    <rect width="1920" height="1080"></rect>
  </svg>
</div>

<h3 class="monitor-title">{sceneTitle === undefined ? '' : sceneTitle}</h3>

<style>
  .monitor {
    color: var(--blackish-darker);
    background-color: var(--blackish-darker);
    aspect-ratio: 16 / 9;
    fill: currentColor;
  }
  .monitor-title {
    margin-top: 1rem;
    text-align: center;
  }
</style>