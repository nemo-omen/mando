<script>
	import { connectionService } from '../machines/connection.machine.js';
	import Logo from './Logo.svelte';
	import ConnectionControl from './ConnectionControl.svelte';
	import SystemInfo from './SystemInfo.svelte';
</script>

<header>
	<a href="/" class="brand">
		<Logo />
		<h1>MANDO</h1>
	</a>
	{#if $connectionService.matches('connected')}
	<div class="info">
		<SystemInfo stat="cpu-usage" statName="CPU" low="25.0" med="50.0" high="75.0"/>
		<SystemInfo stat="memory-usage" statName="MEM" />
	</div>
	{/if}
	<div class="control">
		<ConnectionControl />
	</div>
</header>

<style>
	header {
		padding: 0 1rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-areas: "logo info control";
		gap: 4rem;
		align-items: center;
		border-bottom: 1px solid var(--primary);
	}
	.brand {
		grid-area: logo;
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
	.info {
		grid-area: info;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 1rem;
	}
	.control {
		grid-area: control;
	}
</style>