import OBSWebSocket  from 'obs-websocket-js/dist/obs-websocket.js';
import SetInterval from 'set-interval';
import { connectionService } from '../machines/connection.machine.js';
import { studioModeService } from '../machines/studiomode.machine.js';
import { statsService } from '../machines/stats.machine.js';
import { writable, get } from 'svelte/store';
import { programService } from '../machines/program.machine.js';
import { previewService } from '../machines/preview.machine.js';

export let obs = new OBSWebSocket();

export let stats = writable({});
export let sceneList = writable([]);
export let studioMode = writable(false);
export let currentScene = writable({});
export let previewScene = writable({});
export let sourceTypeNames = writable([]);
export let previewScreenshot = writable("");
export let programScreenshot = writable("");


let pollingInterval = undefined;

function initData() {
  checkStudioModeStatus();
  // startStatPolling();
  checkSceneState();
  getScenes();
  getSourceTypes();
}

function checkStudioModeStatus() {
  studioModeService.send('INIT');
}

function getScenes() {
  obs.send('GetSceneList')
  .then((data) => {
    sceneList.set([...data.scenes]);
  })
  .catch((error) => {
    console.error(error);
  });
}

export function pollStats() {
  
  obs.send('GetStats')
  .then((data) => {
    stats.set(data.stats);
    return data.stats;
  })
  .catch((error) => {
    console.error(error);
  });
}

async function getSourceTypes() {
  const data = await obs.send('GetSourceTypesList');
  const types = await data.types;
  // console.log(types);
  const cleanTypes = types.map((type) => {
    return {
      name: type.typeId,
      displayName: type.displayName,
    }
  });
  sourceTypeNames.set([...cleanTypes]);
}

export async function checkSceneState() {
  if(get(studioMode) === true) {
    checkPreview();
  }
  checkProgram();
}

async function checkProgram() {
  const program = await obs.send('GetCurrentScene');
  currentScene.set({name: program.name, sources: [...program.sources]});
  // console.log('Current scene: ', get(currentScene));
}

async function checkPreview() {
  obs.send('GetPreviewScene')
    .then((data) => {
      previewScene.set({});
      setTimeout(() => {
        previewScene.set({name: data.name, sources: [...data.sources]});
      }, 300);
    })
    .catch((error) => previewScene.set({}));
}

function startStatPolling() {
  SetInterval.start(pollStats, 1000, 'statPolling');
}

function stopStatPolling() {
  SetInterval.clear('statPolling');
}

obs.on('ConnectionOpened', async (data) => {
  
  // check for authRequired
  const authData = await obs.send('GetAuthRequired');
  const authRequired = await authData.authRequired;

  // if we get an auth required response, we know we're connected
  // and ready to start sending requests

  // wait for auth, then start polling stats
  if(authRequired === true) {
    obs.on('AuthenticationSuccess', () => {
      initData()
    });
  } else {
    initData();
  }
});

obs.on('ConnectionClosed', () => {
  stopStatPolling();
  if(connectionService.state.value !== 'disconnected') {
    connectionService.send('DISCONNECTED');
    statsService.send('STOP_POLLING');
    programService.send('STOP_POLLING');
    previewService.send('STOP_POLLING');
  }
});

obs.on('AuthenticationFailure', () => {
  connectionService.send('AUTHENTICATION_FAILED');
});

obs.on('error', (error) => {
  console.error('OBS WebSocket error: ', error);
});

obs.on('SwitchScenes', (data) => {
  checkSceneState();
});

obs.on("PreviewSceneChanged", (data) => {
  checkSceneState();
});

obs.on('StudioModeSwitched', (data) => {
  studioMode.set(data.newState);
  if(data.newState = true) {
    checkSceneState();
  }
});