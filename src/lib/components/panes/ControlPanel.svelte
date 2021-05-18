<script>
  import ScenePanel from './ScenePanel.svelte';
  import SourcePanel from './SourcePanel.svelte';
</script>

<section class="control">

  <section class="scenes control-pane">
    <ScenePanel />
  </section>

  <section class="control-pane">
    <SourcePanel />
  </section>
  <section class="control-pane"></section>
  <section class="control-pane"></section>
</section>

<style>
  .control {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--primary-darker);
    overflow: hidden;
    max-height: 35vh;
  }
  .control > * + * {
    border-left: 1px solid var(--primary-darker);
  }
  .control-pane {
    height: 100%;
    overflow-y: scroll;
  }
</style>