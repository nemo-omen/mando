<script>
  import { fly, fade } from 'svelte/transition';
  import { statsService } from '../machines/stats.machine.js';
  import { stats }from '../services/obs.service.js';
  import { onMount } from 'svelte';
  export let statName = '';
  export let stat;
  export let low = '';
  export let med = '';
  export let high = '';

  onMount(() => {
    statsService.send('POLL');
  });
</script>

{#if $statsService.matches('active') && $stats[stat] !== undefined}
<div class="stat-display" in:fade={{duration: 200, delay: 300}} out:fade={{duration: 200}}>
  <p class="stat-label">{statName}</p>
  <p class="stat">{$stats[stat].toFixed(2)}</p>
</div>
{/if}

<style>
  .stat-display {
    text-align: start;
  }
  .stat-display > * + * {
    margin-top: 0.25rem;
  }
  .stat {
    color: var(--secondary);
    line-height: 1;
  }
  .stat-label {
    color: var(--secondary);
    font-size: 0.75rem;
  }
</style>