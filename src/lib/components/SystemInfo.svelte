<script>
  import { fly, fade } from 'svelte/transition';
  export let statName = "";
  export let stat;
</script>

<div class="stat-display" in:fade={{duration: 200, delay: 300}} out:fade={{duration: 200}}>
  <p class="stat">{stat}</p>
  <p class="stat-label">{statName}</p>
</div>

<style>
  .stat-display {
    text-align: end;
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