<script>
  import '$lib/css/global.css';
  import Header from '$lib/components/Header.svelte';
  import PlayoutPanel from '$lib/components/panes/PlayoutPanel.svelte';
  import BottomPanel from '$lib/components/panes/BottomPanel.svelte';
</script>

<Header />

<main>
  <PlayoutPanel />
  <BottomPanel />
</main>

<style>
  main {
		display: grid;
		grid-template-rows: 70% 30%;
    min-height: 100%;
	}
</style>
