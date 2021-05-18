<script>
  import Icon from './Icon.svelte';
  export let trigger = "";
  export let contentId = ""
  export let icon = true;
  export let title;

  $:active = false;

  let content;

  function toggleHidden() {
    active = !active;
    content.style.maxHeight = !active ? null : content.scrollHeight + "px";
  }

</script>

<ul class="accordion">
  <slot name="title">
    {title}
  </slot>
  <li>
    <button aria-controls={contentId} aria-expanded={!active} on:click|stopPropagation={toggleHidden} class={active ? 'active' : ''}>
      <slot name="trigger">
        {trigger}
      </slot>
      {#if icon = true}
        {#if active === false}
          <Icon name="arrowRight" />
        {:else}
          <Icon name="arrowDown" />
        {/if}
      {/if}
      </button>
    <div class="accordion-content" aria-hidden={!active} bind:this={content}>
      <slot name="content"></slot>
    </div>
  </li>
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 0;
    margin: 0;
  }
  .accordion button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    outline-color: transparent;
    border: none;
    background: transparent;
    padding: 0 0.5rem 0.5rem 0.75rem;
  }
  .accordion button:hover {
    text-decoration: underline;
  }
  .accordion button:focus {
    border-radius: 0;
    outline-color: transparent;
  }
  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 300ms ease-out;
    margin: 0 1rem 0.5rem 1rem;
  }
</style>