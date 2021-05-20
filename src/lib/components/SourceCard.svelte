<script>
  import { onMount, afterUpdate } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { obs, sourceTypeNames } from '../services/obs.service.js';
  import Icon from './Icon.svelte';

  export let source;
  export let open = false;

  $:alignment = source.alignment;
  $:cx = source.cx;
  $:cy = source.cy;
  $:id= source.id;
  $:locked = source.locked;

  $:displayName = "";
  $: sourceSettings = {};

  let sourceItem;
  let summary;

  function getDisplayName() {
    displayName = $sourceTypeNames.filter((sourceType) => {
      return sourceType.name === source.type;
    })[0]?.displayName;
  }

  function toggleVisible() {
    if(!open) {
      sourceItem.style.maxHeight = summary.scrollHeight;
    } else {
      sourceItem.style.maxHeight = sourceItem.scrollHeight;
    }
  }

  function toggleLock() {
    source.locked = !source.locked;
  }

  async function getSourceSettings() {
    const data = await obs.send('GetSourceSettings', {sourceName: source.name, sourceType: source.type});
    sourceSettings = await data.sourceSettings;
    console.log("Source settings: ", sourceSettings);
  }
  
  onMount(async () => {
    getDisplayName();
    getSourceSettings();
  });
  
  afterUpdate(() => {
    getDisplayName();
  });

</script>

<article
  class="source-card"
  transition:fly={{y: 2000, duration: 600, easing: quintInOut}}
  bind:this={sourceItem}
  on:click={getSourceSettings}
  >
  <details bind:open={open} bind:this={summary} on:click|stopPropagation={toggleVisible}>
    <summary>
      <div class="start v-center">
        {#if open}
          <div class="icon before">
            <Icon name="arrowDown" />
          </div>
          {:else}
          <div class="icon before">
            <Icon name="arrowRight" />
          </div>
        {/if}
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
        <div class="icon">
          {#if source.render}
          <Icon name="eye" />
          {:else}
          <Icon name="eyeClosed" />
          {/if}
        </div>
        <div class="icon" on:click|stopPropagation={toggleLock}>
          {#if source.locked}
          <Icon name="lock" />
          {:else}
          <Icon name="unlock" />
          {/if}
        </div>
      </div>
    </summary>
    <section class="source-card-body" transition:slide>
        {#each Object.entries(sourceSettings) as [key, value]}
        <div class="source-settings">

          <header class="source-settings-header">{key}</header>
          
          {#if typeof (value) === 'object'}
          <div class="source-settings-list">
            {#each Object.entries(value) as [subKey, subValue]}
            <div class="source-setting-row">
              <div class="source-setting">
                {subKey}
              </div>
              <div class="source-setting">
                {subValue}
              </div>
            </div>
            {/each}
          </div>
          {:else}
          <div class="source-setting">
            {value}
          </div>
          {/if}
        </div>
          {/each}
        </section>
      </details>
    </article>

<style>
  .source-card {
    border: 1px solid var(--secondary-dark);
    transition: all 300ms ease-in-out;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    overflow: hidden;
  }
  .source-card:hover {
    background-color: var(--blackish-light);
    border-color: var(--secondary-darker);
  }
  .source-card:active {
    background-color: var(--blackish-lighter);
  }
  summary {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    cursor: pointer;
  }
  .source-settings {
    border: 1px solid var(--secondary-dark);
  }
  .source-settings-header {
    padding: 0.5rem;
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid var(--secondary-dark);
    background-color: var(--blackish-light);
  }
  .source-settings-list > * + * {
    border-top: 1px solid var(--secondary-dark);
  }
  .source-setting-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .source-setting-row > * + * {
    border-left: 1px solid var(--secondary-dark);
  }
  .source-setting {
    padding: 0.5rem;
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