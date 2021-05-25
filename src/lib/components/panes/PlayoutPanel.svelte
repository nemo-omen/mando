<script>
  import { onMount, afterUpdate } from 'svelte';
  import { scale, crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { connectionService } from '../../machines/connection.machine.js';
  import { studioModeService } from '../../machines/studiomode.machine.js';
  import Monitor from '../Monitor.svelte';
  import { obs } from '../../services/obs.service.js';


  obs.on('StudioModeSwitched', (data) => {
    console.log(data['new-state']);
    if(data['new-state'] === false) {
      studioModeService.send('STUDIO_OFF');
    }else {
      studioModeService.send('STUDIO_ON');
    }
  });

  studioModeService.onTransition((state) => {
    console.log('Studiomodeservice transition: ', state.value);
  });

  // afterUpdate(() => {
  //   if($connectionService.matches('connected')) {
  //     if($studioModeService.matches('idle')) {
  //       studioModeService.send('INIT');
  //     }
  //   }
  // });

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 300),

    fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 500,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  });
</script>

<section class="playout-panel" style="{$studioModeService.matches('studio') ? 'grid-template-columns: 4fr 1fr 4fr' : 'grid-template-columns: 1fr'}">
  {#if $studioModeService.matches('studio')}
  {#if $connectionService.matches('connected')}
  <section id="preview" class="monitor-pane">
      <div class="playout-display">
        <Monitor role="preview" />
      </div>
    </section>
  {/if}
    <section id="transition" class="control-pane">
      <!-- More Control stuff here!-->
    </section>
    {#if $connectionService.matches('connected')}
    <section id="program" class="monitor-pane">
      <div class="playout-display">
        <Monitor role="program" />
      </div>
    </section>
    {/if}
    {:else} <!--Not studio mode-->
    {#if $connectionService.matches('connected')}
    <section id="program" class="monitor-pane">
      <div class="playout-display">
        <Monitor role="program" />
      </div>
    </section>
    {/if}
    {/if}
</section>

<style>
  .playout-panel {
    display: grid;
    background: var(--blackish-dark);
    padding: 3rem;
    /* max-height: 100%; */
  }
  .monitor-pane {
    display: flex;
    justify-content: center;
  }
  .control-pane {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
</style>