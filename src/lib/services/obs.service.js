import OBSWebSocket  from 'obs-websocket-js/dist/obs-websocket.js';
import SetInterval from 'set-interval';
import { connectionService } from '../machines/connection.machine.js';
import { writable, get } from 'svelte/store';

export let obs = new OBSWebSocket();

export let stats = writable({});
export let sceneList = writable([]);
export let currentScene = writable({});
export let previewScene = writable({});
export let sourceTypeNames = writable([]);

let pollingInterval = undefined;

function initData() {
  startStatPolling();
  getScenes();
  checkSceneState();
  getSourceTypes();
}

function getScenes() {
  obs.send('GetSceneList')
  .then((data) => {
    // console.log("Scenes", data.scenes);
    sceneList.set([...data.scenes]);
  })
  .catch((error) => {
    console.error(error);
  });
}

function startStatPolling() {
  SetInterval.start(pollStats, 1000, 'statPolling');
}

function stopStatPolling() {
  SetInterval.clear('statPolling');
}

function pollStats() {
  obs.send('GetStats')
  .then((data) => {
    stats.set(data.stats);
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
  console.log(get(sourceTypeNames));
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

export async function checkSceneState() {
  checkProgram();
  checkPreview();
}

async function checkProgram() {
  const program = await obs.send('GetCurrentScene');
  currentScene.set({name: program.name, sources: [...program.sources]});
  // console.log("Current scene: ", get(currentScene));
}

async function checkPreview() {
  const preview = await obs.send('GetPreviewScene');
  previewScene.set({name: preview.name, sources: [...preview.sources]});
}

obs.on('ConnectionClosed', () => {
  stopStatPolling();
  if(connectionService.state.value !== 'disconnected') {
    connectionService.send('DISCONNECTED');
  }
});

obs.on('AuthenticationFailure', () => {
  connectionService.send('AUTHENTICATION_FAILED');
});

obs.on('error', (error) => {
  console.error('OBS WebSocker error: ', error);
});

obs.on('SwitchScenes', (data) => {
  checkSceneState();
});

obs.on("PreviewSceneChanged", (data) => {
  checkSceneState();
})