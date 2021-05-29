<script>
  import { onMount, afterUpdate } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { obs, sourceTypeNames } from '../services/obs.service.js';
  import Icon from './Icon.svelte';

  export let source;
  export let parent;
  export let open = false;

  $:alignment = source.alignment;
  $:cx = source.cx;
  $:cy = source.cy;
  $:id= source.id;
  $:locked = source.locked;
  $:visible = source.render;

  $:displayName = "";
  $:sourceSettings = {};

  let sourceItem;
  let summary;

  function getDisplayName() {
    displayName = $sourceTypeNames.filter((sourceType) => {
      return sourceType.name === source.type;
    })[0]?.displayName;
  }

  async function toggleVisible() {
    source.render = !source.render;

    obs.send('SetSceneItemRender', {
      "scene-name": parent,
      source: source.name,
      render: source.render
    });
  }

  function toggleLock() {
    source.locked = !source.locked;
  }

  async function getSourceSettings() {
    const data = await obs.send('GetSourceSettings', {sourceName: source.name, sourceType: source.type});
    sourceSettings = await data.sourceSettings;
  }

  async function openSettings() {

  }
  
  onMount(async () => {
    getDisplayName();
    getSourceSettings();
  });
  
  afterUpdate(() => {
    getDisplayName();
    getSourceSettings();
  });

</script>

<article
  class="source-card"
  transition:fly={{y: 2000, duration: 600, easing: quintInOut}}
  bind:this={sourceItem}
  >
      <div class="start v-center">
        <h4 class="third">
          {source.name}
        </h4>
        {#if displayName !== undefined && displayName !== ""}
        <div class="icon second">
          <Icon name="{displayName.replace('(', '').replace(')', '').split(' ').slice(0, 2).join('').toLowerCase()}" title={displayName.split(' ').slice(0, 2).join(' ')} />
        </div>
        {/if}
      </div>
      <div class="end v-center">
        <div class="icon" on:click|stopPropagation={toggleVisible}>
          {#if source.render}
          <Icon name="eye" title="Visible" />
          {:else}
          <Icon name="eyeClosed" title="Hidden" />
          {/if}
        </div>
        <div class="icon" on:click|stopPropagation={toggleLock}>
          {#if source.locked}
          <Icon name="lock" title="Locked" />
          {:else}
          <Icon name="unlock" title="Unlocked" />
          {/if}
        </div>
        <div class="icon" on:click|stopPropagation={openSettings}>
          <Icon name="settings" title="Settings" />
        </div>
      </div>
    
    </article>

<style>
  .source-card {
    border: 1px solid var(--secondary-dark);
    transition: all 300ms ease-in-out;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .source-card:hover {
    background-color: var(--blackish-light);
    border-color: var(--secondary-darker);
  }
  .source-card:active {
    background-color: var(--blackish-lighter);
  }
  .v-center {
    align-items: center;
  }
  .start {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }
  .end {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  .icon {
    display: flex;
    align-items: center;
  }
  .before {
    order: -1;
  }
  .second {
    order: 0;
  }
  .third {
    order: 1;
  }
</style>