import { obs } from '../services/obs.service.js';
import { Machine, interpret, forwardTo, assign } from "xstate";

async function getImgFormat() {
  let format = 'jpg';
  const data = await obs.send('GetVersion');
  const formats = await data["supported-image-export-formats"];

  if(!formats.includes('jpg')) {
    format = "png";
  }
  console.log("Format: ", format);
  return format;
}

async function pollScreenshot(role, format, sceneName) {
  let shot = '';
  setTimeout(async () => {
    const data = await obs.send('TakeSourceScreenshot', 
      {
        sourceName: sceneName,
        embedPictureFormat: format,
        compressionQuality: 25,
        width: 640,
        height: 360
      }
    );
    shot = await data.img;
  }, 50);
  console.log("Shot: ", shot);
  return shot;
}

const monitorMachine = Machine({
  id: 'monitor',
  initial: 'idle',
  context: {
    role: '',
    sceneName: undefined,
    format: 'jpg',
    screenshot: undefined,
    error: null,
  },
  states: {
    idle: {
      on: {
        INIT: {
          actions: [
            (context, event) => {
              const { role, sceneName } = event;
              assign({role, sceneName});
            }
          ],
          target: 'checkformat',
        }
      }
    },
    checkformat: {
      invoke: {
        id: 'check-format',
        src: (context, event) => getImgFormat(),
        onDone: {
          target: 'start',
          actions: assign({format: (context, event) => event.data})
        },
        onError: {
          target: 'failure',
          actions: assign({error: (context, event) => event.data}),
        }
      },
    },
    start: {
      invoke: {
        id: 'pollscreenshot',
        src: (context, event) => pollScreenshot(context.role, context.format, context.sceneName)
      },
      onDone: {
        actions: assign({screenshot: (context, event) => event.data}),
        target: 'start',
      },
      on: {
        STOP: 'idle',
      }
    },
    failure: {
      always: {
        target: 'idle'
      }
    }
  }
});

const monitorService = interpret(monitorMachine).start();
export { monitorService };