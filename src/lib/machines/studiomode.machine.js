import { Machine, interpret, forwardTo, assign } from "xstate";
import { inspect } from '@xstate/inspect';
import { obs, studioMode } from '../services/obs.service.js';

inspect({
  iframe: false
});

const studioModeMachine = Machine({
  id: 'studioMode',
  initial: 'idle',
  context: {
    studioMode: false,
  },
  states: {
    idle: {
      on: {
        INIT: {
          actions: forwardTo('check-studio'),
        },
        STUDIO_ON: {
          target: 'studio'
        },
        STUDIO_OFF: {
          target: 'program'
        },
        EXIT: {
          target: 'idle'
        }
      },
      invoke:[ 
      {
        id: 'check-studio',
        src: 'checkStudioMode'
      },
      {
        id: 'disable-studio',
        src: 'disableStudioMode'
      },
      {
        id: 'enable-studio',
        src: 'enableStudioMode'
      }
    ]
    },
    studio: {
      on: {
        entry: {
          actions: forwardTo('enable-studio')
        },
        STUDIO_OFF: {
          target: 'program'
        },
        EXIT: {
          target: 'idle'
        }
      },
      invoke: {
        id: 'enable-studio',
        src: 'enableStudioMode'
      }
    },
    program: {
      on: {
        entry: {
          actions: forwardTo('disable-studio')
        },
        STUDIO_ON: {
          target: 'studio'
        },
        EXIT: {
          target: 'idle'
        }
      },
      invoke: [
        {
          id: 'disable-studio',
          src: 'disableStudioMode'
        }
      ]
    },
  }
},{
  services: {
    checkStudioMode: () => (send, onReceive) => {
      onReceive((event) => {
        if(event.type === 'INIT') {
          obs.send('GetStudioModeStatus')
            .then((data) => {
              console.log('Studio mode data: ', data);
              if(data.studioMode === true) {
                send('STUDIO_ON');
              } else {
                send('STUDIO_OFF');
              }
            })
            .catch((error) => {
              console.error(error);
              // context.studioMode = false;
              // send('STUDIO_OFF');
            });
        }
      });
    },
    disableStudioMode: () => (send, onReceive) => {
      onReceive((event, context) => {
        obs.send('DisableStudioMode');
      });
    },
    enableStudioMode: () => (send, onReceive) => {
      onReceive((event) => {
        obs.send('EnableStudioMode');
      }); 
    }
  }
});

const studioModeService = interpret(studioModeMachine, {devtools: true}).start();
export { studioModeService };