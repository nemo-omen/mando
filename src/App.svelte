<script>
  import '$lib/css/global.css';
  import Header from '$lib/components/Header.svelte';
  import PlayoutPanel from '$lib/components/panes/PlayoutPanel.svelte';
  import ControlPanel from '$lib/components/panes/ControlPanel.svelte';
</script>

<!-- <Header /> -->

<main>
  <PlayoutPanel />
  <ControlPanel />
</main>

<style>
  main {
		display: grid;
		grid-template-rows: 70vh 30vh;
    min-height: 100%;
	}
</style>
