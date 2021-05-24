<script>
	import {getContext, setContext} from 'svelte';
	import Logo from './Logo.svelte';
	import ConnectionControl from './ConnectionControl.svelte';
</script>

<header>
		<a href="/" class="brand">
			<Logo />
			<h1>MANDO</h1>
		</a>
	<ConnectionControl />
</header>

<style>
	header {
		padding: 0 1rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		justify-items: end;
		gap: 4rem;
		align-items: center;
		border-bottom: 1px solid var(--primary);
	}
	.brand {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-self: start;
		transform: scale(1);
		transition: color 200ms ease-out;
		color: var(--secondary);
		text-decoration: none;
		font-size: 4vh;
		padding: 0;
		margin: 0;
	}
	.brand:hover {
		color: var(--primary);
	}
	.brand h1 {
		font-weight: 600;
		margin: 0;
		padding: 0;
		letter-spacing: 14px;
	}
</style>