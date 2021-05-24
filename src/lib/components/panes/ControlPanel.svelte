<script>
  import { studioModeService } from '../../machines/studiomode.machine.js';

  function toggleStream() {}

  function toggleRecord() {}

  function toggleStudioMode() {
    if($studioModeService.matches('studio')) {
      studioModeService.send('TOGGLE_STUDIO_OFF');
    } else {
      studioModeService.send('TOGGLE_STUDIO_ON');
    }
  }
</script>

<section class="control-panel">
  <button on:click={toggleStream}>Stream</button>
  <button on:click={toggleRecord}>Record</button>
  <button on:click={toggleStudioMode} class="{$studioModeService.matches('studio') ? 'active' : ''}">Studio Mode</button>

</section>

<style>
  .control-panel {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .active {
    background-color: var(--blackish-secondary);
  }
  .active:hover {
    background-color: var(--blackish-secondary-light);
  }
  .active:active {
    background-color: var(--blackish-secondary-lighter);
  }
</style>