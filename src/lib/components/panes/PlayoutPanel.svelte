<script>
  import Monitor from '../Monitor.svelte';
  import { scale } from 'svelte/transition';
  import { connectionService } from '../../machines/connection.machine.js';
  import ConnectionControl from '../ConnectionControl.svelte';
  import Logo from '../Logo.svelte';
  let studioMode = true;
</script>

<section class="control-panel" style="{studioMode ? 'grid-template-columns: 4fr 1fr 4fr' : 'grid-template-rows: 1fr'}">
  {#if studioMode}
  <section id="preview" class="control-pane">
      {#if $connectionService.matches('connected')}
      <div class="playout-display" transition:scale>
        <Monitor role="preview" />
      </div>
      {/if}
    </section>
    <section id="transition" class="control-pane">
      <Logo />
      <ConnectionControl />
    </section>
    <section id="program" class="control-pane">
      {#if $connectionService.matches('connected')}
      <div class="playout-display" transition:scale>
        <Monitor role="program" />
      </div>
      {/if}
    </section>
  {:else}
    <section id="program" class="control-pane vertical">
      <div class="playout-display" transition:scale></div>
    </section>
    {/if}
</section>

<style>
  .control-panel {
    max-height: 65vh;
    position: relative;
    display: grid;
    background: var(--blackish-dark);
  }
  .control-pane {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding: 2rem;
  }
  .playout-display {
    max-height: 40vh;
    width: 100%;
    background-color: var(--blackish-darker);
    aspect-ratio: 16 / 9;
  }
</style>