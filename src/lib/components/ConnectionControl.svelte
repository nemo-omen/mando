<script>
  import { afterUpdate, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { connectionService } from '../machines/connection.machine.js';
  import { stats } from '../services/obs.service.js';
  // import SystemInfo from './SystemInfo.svelte';

  let address = "";
  let password = "";

  let savedAddress;

  let addressHistory = [];
  
  let input;

  let isConnected = false;
  
  $: isAuthError = false;
  $: isAddressError = false;

  $: connectionState = connectionService.state.value;

  async function connectionToggle() {
    if(connectionService.state.matches('inactive') || connectionService.state.matches('failed')) {

      const connectionOptions = password === "" ? {address} : {address, password};
      
      connectionService.send('CONNECT', connectionOptions);

      } else if(connectionService.state.matches('connected')) {

      connectionService.send('DISCONNECT');
    }
  }

  // basic timeout to clear error states
  // TODO: move this into the state machine
  function timeoutError(error) {
    setTimeout(() => {
      switch(error) {
        case 'address':
          isAddressError = false;
          break;
        case 'auth':
          isAuthError = false;
          break;
      }
    }, 3000);
  }
  
  function saveAddresses() {
    const uniqueAddresses = new Set();
    addressHistory.push(address);
    addressHistory.forEach(address => uniqueAddresses.add(address));
    addressHistory = [...uniqueAddresses];
    window.localStorage.setItem('lastAddress', address);
    window.localStorage.setItem('addressHistory', JSON.stringify(addressHistory));
  }

  function scaleInput() {
    input.style.maxHeight = $connectionService.value !== 'connected' ? (input.scrollHeight + 16) + "px" : 0;
    input.style.paddingTop = $connectionService.value !== 'connected' ? (0.5) + "rem" : 0;
    input.style.paddingBottom = $connectionService.value !== 'connected' ? (0.5) + "rem" : 0;
  }

  onMount(() => {
    savedAddress = window.localStorage.getItem('lastAddress');
    let lsHistory = JSON.parse(window.localStorage.getItem('addressHistory'));
    if(lsHistory !== undefined && lsHistory !== null) {
      addressHistory = [...lsHistory];
    }
    if(savedAddress !== undefined || savedAddress !== null) {
      address = savedAddress;
    }
    scaleInput();
  });

  afterUpdate(() => {
    scaleInput();
  });

  connectionService.onTransition((state) => {
    const value = state.value;
    isConnected = value === 'connected';

    switch(value) {
      case 'inactive':
        break;
      case 'connected':
        saveAddresses();
        break;
      case 'connection_failed':
        isAddressError = true;
        timeoutError('address');
        break;
      case 'authentication_failed':
        isAuthError = true;
        timeoutError('auth');
        break;
    }
  });

</script>

<section class="control vertical">
  
  <form on:submit|preventDefault={connectionToggle} class="vertical">
    <div class="input-group" bind:this={input}>
      <input 
      id="address-input"
      class={isAddressError ? 'error' : ''} disabled={$connectionService.value === 'connected' ? true : undefined}
      type="text" 
      list="address-history" 
      placeholder="Address (localhost:4444)"
      bind:value={address} 
      in:fade={{duration: 200, delay: 300, easing: quintInOut}}
      out:fade={{duration: 200, easing: quintInOut}} >
      
      <datalist id="address-history">
        {#each addressHistory as address}
        <option value={address}>
        {/each}
      </datalist>
        
        <input
        type="password"
        id="password-input" 
        class={isAuthError ? 'error' : ''} disabled={$connectionService.value === 'connected' ? true : undefined}
        placeholder="Password" 
        in:fade={{duration: 200, delay: 300, easing: quintInOut}} 
        out:fade={{duration: 200, easing: quintInOut}} 
        bind:value={password} >
      </div>
        
      <button class="{$connectionService.value.toString()} {$connectionService.value === 'connected' ? 'scaled' : ''}">
        {#if $connectionService.matches('inactive')}
        Connect
        {:else if $connectionService.matches('connected')}
        Disconnect
        {:else if $connectionService.matches('authentication_failed') || $connectionService.matches('connection_failed')}
        Failed
        {/if}
      </button>

    </form>

    <!-- {#if $connectionService.matches('connected')}
    <div class="system-info horizontal">
      {#if $stats["cpu-usage"] !== undefined}
      <SystemInfo stat={$stats["cpu-usage"].toFixed(2) + "%"} statName="CPU" />
      <SystemInfo stat={$stats["fps"].toFixed(2)} statName="FPS" />
      {/if}
    </div>
    {/if} -->

  </section>


<style>
  .control {
    --border: 1px solid var(--secondary-darker);
    --borderFocusColor: var(--secondary-dark);
    --background: var(--blackish-light);
    margin-top: 1rem;
  }
  .vertical {
    display: flex;
    flex-direction: column;
  }
  .horizontal {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .input-group {
    max-height: 0;
    overflow: hidden;
    transition: max-height 300ms ease-out, padding 300ms ease-out;
    padding: 0 2px;
  }

  .input-group > * + * {
    margin-top: 1rem;
  }

  .system-info {
    border-top: 1px solid var(--secondary-darker);
    padding-top: 1rem;
  }

  form > * + * {
    margin-top: 1rem;
  }

  .control-input {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    grid-area: input;
  }
  .control-submit {
    display: flex;
    grid-area: submit;
    min-width: 130px;
  }
  button {
    width: 100%;
    padding: 0.5rem 0;
    transform-origin: top center;
    transition: all 300ms ease-out;
    margin: 1rem auto;
  }
  .scaled {
    width: 70%;
    margin-top: 0;
  }
  .connected {
    background-color: var(--secondary-darker);
  }
  .connected:hover {
    background-color: var(--secondary-dark);
  }
  .connected:active {
    background-color: var(--secondary);
    color: var(--blackish);
  }
  .authentication_failed, .connection_failed {
    background-color: var(--primary-darker);
  }
  .connection_failed:hover, .authentication_failed:hover {
    background-color: var(--primary-dark);
  }
  .connection_failed:active, .authentication_failed:active {
    background-color: var(--primary);
  }
  .error {
    outline: 1px solid var(--primary-darker);
    color: var(--whitish-warn);
    background: var(--blackish-warn);
  }
  .error:focus {
    outline: 1px solid var(--primary-dark);
  }
</style>