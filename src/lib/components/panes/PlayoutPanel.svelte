<script>
  import { onMount, afterUpdate } from 'svelte';
  import { scale } from 'svelte/transition';
  import { connectionService } from '../../machines/connection.machine.js';
  import { studioModeService } from '../../machines/studiomode.machine.js';
  import Monitor from '../Monitor.svelte';
  import { obs } from '../../services/obs.service.js';

  afterUpdate(() => {
    if($connectionService.matches('connected')) {
      if($studioModeService.matches('idle')) {
        studioModeService.send('INIT');
      }
    }
  })
</script>

<section class="playout-panel" style="{$studioModeService.matches('studio') ? 'grid-template-columns: 4fr 1fr 4fr' : 'grid-template-rows: 1fr'}">
  {#if $studioModeService.matches('studio')}
  <section id="preview" class="monitor-pane">
      {#if $connectionService.matches('connected')}
      <div class="playout-display" transition:scale>
        <Monitor role="preview" />
      </div>
      {/if}
    </section>
    <section id="transition" class="control-pane">
      <!-- More Control stuff here!-->
    </section>
    <section id="program" class="monitor-pane">
      {#if $connectionService.matches('connected')}
      <div class="playout-display" transition:scale>
        <Monitor role="program" />
      </div>
      {/if}
    </section>
    {:else} <!--Not studio mode-->
    <section id="program" class="monitor-pane">
      {#if $connectionService.matches('connected')}
      <div class="playout-display" transition:scale>
        <Monitor role="program" />
      </div>
      {/if}
    </section>
    {/if}
</section>

<style>
  .playout-panel {
    display: grid;
    background: var(--blackish-dark);
    padding: 3rem;
    max-height: 100%;
  }
  .control-pane {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
</style>