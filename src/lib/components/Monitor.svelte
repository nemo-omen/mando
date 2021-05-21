<script>
  import { fade } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import {  obs, 
            currentScene,
            previewScene, 
            startScreenshotPolling, 
            stopScreenshotPolling, 
            previewScreenshot,
            programScreenshot
          } from '../services/obs.service.js';
  import { connectionService } from '../machines/connection.machine.js';

  export let role;
  $:screenshot = role === 'preview' ? $previewScreenshot : $programScreenshot;

  connectionService.onTransition((state) => {
    if(state.value === 'connected') {
        startScreenshotPolling(role);
      } else {
        stopScreenshotPolling(role);
      }
  });



</script>

<div class="monitor">
  <img src={screenshot} alt="{role} screenshot">
</div>
<div class="monitor-title">
  {#if role === 'preview'}
  <h3 transition:fade={{duration: 200, easing: quintInOut}}>{$previewScene.name || ""}</h3>
  {:else if role === 'program'}
  <h3 transition:fade={{duration: 200, easing: quintInOut}}>{$currentScene.name || ""}</h3>
  {/if}
</div>

<style>
  img {
    width: 100%;
  }
  .monitor-title {
    margin-top: 1rem;
    text-align: center;
  }
</style>