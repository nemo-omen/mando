<script>
  import ScenePanel from './ScenePanel.svelte';
  import SourcePanel from './SourcePanel.svelte';
  import ControlPanel from './ControlPanel.svelte';
</script>

<section class="control">

  <section class="scenes control-pane scroll">
    <header class="pane-header">
      <h2 class="pane-heading">Scenes</h2>
    </header>
    <ScenePanel />
  </section>

  <section class="control-pane scroll">
    <header class="pane-header">
      <h2 class="pane-heading">Sources</h2>
    </header>
    <SourcePanel />
  </section>
  <section class="control-pane scroll">
    <header class="pane-header">
      <h2 class="pane-heading">Audio</h2>
    </header>
  </section>
  <section class="control-pane scroll">
    <header class="pane-header">
      <h2 class="pane-heading">Control</h2>
    </header>
    <ControlPanel />
  </section>
</section>

<style>
  .control {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 6px solid var(--blackish-secondary);
    max-height: 100%;
  }
  .control-pane {
    position: relative;
    border-top: 1px solid var(--blackish);
    background: var(--blackish-dark);
    /* padding-top: 2.5rem; */
  }
  .pane-header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.25rem 0.5rem;
    background: var(--blackish);
    border-bottom: 1px solid var(--blackish-light);
  }
  .pane-heading {
    font-size: 1.2rem;
  }
</style>