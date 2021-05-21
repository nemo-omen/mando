<script>
  import ScenePanel from './ScenePanel.svelte';
  import SourcePanel from './SourcePanel.svelte';
</script>

<section class="control">

  <section class="scenes control-pane scroll">
    <ScenePanel />
  </section>

  <section class="control-pane scroll">
    <SourcePanel />
  </section>
  <section class="control-pane scroll"></section>
  <section class="control-pane scroll"></section>
</section>

<style>
  .control {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--primary-darker);
    max-height: 30vh;
  }
  .control-pane {
    height: 100%;
  }
</style>