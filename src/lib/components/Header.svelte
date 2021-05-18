<script>
	import {getContext, setContext} from 'svelte';
	import Logo from './Logo.svelte';
	import ConnectionControl from './ConnectionControl.svelte';
</script>

<header>
		<a href="/">
			<Logo />
		</a>
	<ConnectionControl />
</header>

<style>
	header {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		justify-items: end;
		gap: 4rem;
		align-items: center;
		border-bottom: 1px solid var(--primary);
	}
	a {
		transform: scale(1);
		transition: transform 200ms ease-out;
	}
	a:hover {
		transform: scale(1.2);
	}
</style>