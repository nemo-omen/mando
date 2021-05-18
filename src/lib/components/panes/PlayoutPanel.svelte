<script>
  import ConnectionControl from '../ConnectionControl.svelte';
  import Logo from '../Logo.svelte';
  let studioMode = true;
</script>

<section class="control-panel" style="{studioMode ? 'grid-template-columns: 4fr 1fr 4fr' : 'grid-template-rows: 1fr'}">
  {#if studioMode}
    <section id="preview" class="control-pane">
      <div class="playout-display"></div>
    </section>
    <section id="transition" class="control-pane">
      <Logo />
      <ConnectionControl />
    </section>
    <section id="program" class="control-pane">
      <div class="playout-display"></div>
    </section>
  {:else}
    <section id="program" class="control-pane vertical">
      <div class="playout-display"></div>
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
    padding: 3rem;
  }
  .playout-display {
    max-height: 60vh;
    background-color: var(--blackish-darker);
    aspect-ratio: 16 / 9;
  }
</style>