<script>
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

<style>
  img {
    width: 100%;
  }
</style>