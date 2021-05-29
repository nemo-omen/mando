<script>
  import { afterUpdate, onMount } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { switchService} from '../machines/switch.machine.js';
  import { previewService } from '../machines/preview.machine.js';
  import { obs, currentScene, previewScene, checkSceneState } from '../services/obs.service.js';
  import { selectedScene } from '../stores/ui.store.js';
  import Icon from './Icon.svelte';

  export let scene = {};

  let selected = false;

  $: isProgram = scene.name === $currentScene?.['name'] ? true : false;
  $: isPreview = scene.name === $previewScene?.['name'] ? true : false;
  $: isIdle = (isPreview === false && isProgram === false);

  function handleSceneClick() {
    setSelected();

    switchService.send('PUSH', {name: scene.name});
  };

  function setSelected() {
    selected = !selected;
    // selectedScene.set(scene);
  }

  onMount(async () => {
    selected = isPreview;
  });

</script>

<article 
  class="scene-card {isProgram ? 'program' : isPreview ? 'preview' : 'idle'}" 
  transition:fly={{y: 2000, duration: 600, easing: quintInOut}}
  on:click={handleSceneClick}
  >
  <h4>{scene.name}</h4>
  <div class="icon {isPreview ? 'icon-preview' : isProgram ? 'icon-program' : 'icon-idle'}">
    {#if isProgram}
    <Icon name="eye" />
    {:else}
    <Icon name="eyeOff" />
    {/if}
  </div>
</article>

<style>
  .scene-card {
    border: 1px solid var(--secondary-dark);
    transition: all 300ms ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }
  .scene-card:hover {
    background-color: var(--blackish-light);
    border-color: var(--secondary-darker);
  }
  .scene-card:active {
    background-color: var(--blackish-lighter);
  }
  .program {
    background-color: var(--blackish-tertiary);
    border-color: var(--tertiary);
    outline: 1px solid var(--tertiary);
  }
  .program:hover {
    background-color: var(--blackish-tertiary-light);
  }
  .program:active {
    background-color: var(--blackish-tertiary-lighter);
  }
  .preview {
    background-color: var(--blackish-secondary);
  }
  .preview:hover {
    background-color: var(--blackish-secondary-light);
  }
  .preview:active {
    background-color: var(--blackish-secondary-lighter);
  }
  .icon {
    background-color: none;
  }
  .icon-preview, .icon-program {
    color: var(--whitish);
  }
  .icon-idle {
    color: var(--whitish-darker);
  }
  :global([data-accordion]) {
		list-style: none;
    margin: 0;
    padding: 0;
	}
  
	:global([data-accordion-item] button) {
    border: 0;
		background: none;
		font: inherit;
		line-height: inherit;
		color: inherit;
		cursor: pointer;
		width: 100%;
		text-align: left;
		margin: 0;
    padding: 0.5rem 1rem;
    outline-color: transparent;
    border-bottom: 1px solid var(--secondary-dark);
	}

	:global([data-accordion-item] [role="region"]) {
		padding: 0.5rem 1.5rem;
	}
</style>