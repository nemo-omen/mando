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

  onMount(() => {
    savedAddress = window.localStorage.getItem('lastAddress');
    let lsHistory = JSON.parse(window.localStorage.getItem('addressHistory'));
    if(lsHistory !== undefined && lsHistory !== null) {
      addressHistory = [...lsHistory];
    }
    if(savedAddress !== undefined || savedAddress !== null) {
      address = savedAddress;
    }
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

<section class="control">
  
  <form on:submit|preventDefault={connectionToggle} class="horizontal">
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
        
      <button class="{$connectionService.value.toString()}">
        {#if $connectionService.matches('inactive')}
        Connect
        {:else if $connectionService.matches('connected')}
        Disconnect
        {:else if $connectionService.matches('authentication_failed') || $connectionService.matches('connection_failed')}
        Failed
        {/if}
      </button>

    </form>

  </section>


<style>
  .control {
    --border: 1px solid var(--secondary-darker);
    --borderFocusColor: var(--secondary-dark);
    --background: var(--blackish-light);
  }
  .system-info {
    border-top: 1px solid var(--secondary-darker);
  }
  form {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-areas: "input submit";
    grid-gap: 1rem;
  }

  .input-group {
    transition: max-width 300ms ease-out, padding 300ms ease-out;
    display: flex;
    gap: 1rem;
    grid-area: input;
    transform-origin: 100% 50%;
  }
  button {
    width: 100%;
    height: 100%;
    transform-origin: top center;
    transition: all 300ms ease-out;
    grid-area: submit;
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