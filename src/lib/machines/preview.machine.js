import { obs, previewScreenshot, previewScene } from '../services/obs.service.js';
import { get } from 'svelte/store';
import { Machine, interpret, forwardTo, assign } from "xstate";

const previewMachine = Machine({
  id: 'preview',
  initial: 'idle',
  context: {
    role: undefined,
    screenshot: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        POLL: { 
          target: 'active',
        },
      }
    },
    active: {
      activities: ['polling'],
      on: {
        STOP_POLLING: { target: 'idle' },
      }
    }
  },
},
  {
    activities: {
      polling: (context, event) => {
        const interval = setInterval(async() => {
          const imgData = await obs.send('TakeSourceScreenshot', {
            sourceName: get(previewScene)?.name,
            embedPictureFormat: 'png',
            width: 640,
            height: 360
          });
          if(!imgData.error) {
            context.screenshot = await imgData.img;
            previewScreenshot.set(imgData.img);
          } else {
            context.error = await imgData.error;
          }
        }, 500);

        return () => clearInterval(interval);
      }
    }
  }
);

const previewService = interpret(previewMachine).start();
export { previewService };