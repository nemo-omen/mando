import { obs, previewScreenshot, programScreenshot } from '../services/obs.service.js';
import { Machine, interpret, forwardTo, assign } from "xstate";

const monitorMachine = Machine({
  id: 'monitor',
  initial: 'idle',
  context: {
    role: undefined,
    screenshot: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        POLL: { target: 'active' },
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
            sourceName: event.sourceName,
            embedPictureFormat: 'png',
            width: 640,
            height: 360
          });
          console.log('Image data: ', await imgData);
          if(!imgData.error) {
            console.log(imgData.img);
            context.screenshot = await imgData.img;
            if(event.role === 'preview') {
              previewScreenshot.set(imgData.img);
            } else {
              programScreenshot.set(imgData.img);
            }
          } else {
            context.error = await imgData.error;
          }
        }, 50);

        return () => clearInterval(interval);
      }
    }
  }
);

const monitorService = interpret(monitorMachine).start();
export { monitorService };