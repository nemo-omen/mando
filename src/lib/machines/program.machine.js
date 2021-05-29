import { obs, programScreenshot, currentScene } from '../services/obs.service.js';
import { Machine, interpret, forwardTo, assign } from "xstate";

const programMachine = Machine({
  id: 'program',
  initial: 'idle',
  context: {
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
            sourceName: currentScene?.name,
            embedPictureFormat: 'png',
            width: 640,
            height: 360
          });
          if(!imgData.error) {
            context.screenshot = await imgData.img;
            programScreenshot.set(imgData.img);
          } else {
            context.error = await imgData.error;
          }
        }, 500);

        return () => clearInterval(interval);
      }
    }
  }
);

const programService = interpret(programMachine).start();
export { programService };