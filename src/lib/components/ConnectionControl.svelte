<script>
  import { getContext, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { connectionService } from '../machines/connection.machine.js';
  import { stats } from '../services/obs.service.js';
  import SystemInfo from './SystemInfo.svelte';

  let address = "";
  let password = "";

  let savedAddress;

  let addressHistory = [];
  
  const obs = getContext('obs');
  
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
    console.log(value);

    switch(value) {
      case 'idle':
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
  })

</script>

<section class="control-horizontal">
  {#if $connectionService.matches('connected')}
    <div class="system-info">
      {#if $stats["cpu-usage"] !== undefined}
      <SystemInfo stat={$stats["cpu-usage"].toFixed(2) + "%"} statName="CPU" />
      <SystemInfo stat={$stats["memory-usage"].toFixed(2) + "MB"} statName="MEM" />
      <SystemInfo stat={$stats["fps"].toFixed(2)} statName="FPS" />
      {/if}
    </div>
  {/if}
  <form on:submit|preventDefault={connectionToggle}>
    <section class="control-input">
        <input in:fade={{duration: 200, delay: 300, easing: quintInOut}} out:fade={{duration: 200, easing: quintInOut}} type="text" bind:value={address} list="address-history" class={isAddressError ? 'error' : ''} disabled={$connectionService.value === 'connected' ? true : undefined}>
        <datalist id="address-history">
          {#each addressHistory as address}
          <option value={address}>
            {/each}
          </datalist>
          <input in:fade={{duration: 200, delay: 300, easing: quintInOut}} out:fade={{duration: 200, easing: quintInOut}} type="password" placeholder="Password" bind:value={password} class={isAuthError ? 'error' : ''} disabled={$connectionService.value === 'connected' ? true : undefined}>
    </section>
    <section class="control-submit">
      <button class={$connectionService.value.toString()}>
        {#if $connectionService.matches('inactive')}
        Connect
        {:else if $connectionService.matches('connected')}
        Disconnect
        {:else if $connectionService.matches('authentication_failed') || $connectionService.matches('connection_failed')}
        Failed
        {/if}
      </button>
    </section>
    </form>
  </section>

<style>
  .control-horizontal {
    --border: 1px solid var(--secondary-darker);
    --borderFocusColor: var(--secondary-dark);
    --background: var(--blackish-light);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "info control";
    gap: 2rem;
    align-items: center;
  }
  form {
    display: grid;
    grid-template-columns: 4fr 1fr;
    grid-template-areas: "input submit";
    grid-gap: 1rem;
    padding: 0.25rem;
    grid-area: control;
  }

  .control-input {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    grid-area: input;
  }
  
  .system-info {
    grid-area: info;
    display: flex;
    gap: 1rem;
  }
  .control-submit {
    display: flex;
    grid-area: submit;
    min-width: 130px;
  }
  button {
    width: 100%;
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