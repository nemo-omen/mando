import { Machine, interpret, forwardTo, assign } from "xstate";
import { inspect } from '@xstate/inspect';
import { obs, studioMode } from '../services/obs.service.js';

function enableStudioMode() {
  obs.send('EnableStudioMode');
}

function disableStudioMode() {
  obs.send('DisableStudioMode');
}

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
        TOGGLE_STUDIO_ON: {
          target: 'studio_toggle',
        },
        STUDIO_ON: {
          target: 'studio'
        },
        TOGGLE_STUDIO_OFF: {
          target: 'program_toggle',
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
      }
    ]
    },
    studio_toggle: {
      invoke: {
        id: 'enable-studio',
        src: (event, context) => enableStudioMode,
      },
      on: {
        STUDIO_ON: {
          target: 'studio'
        }
      }
    },
    studio: {
      on: {
        TOGGLE_STUDIO_OFF: {
          target: 'program_toggle'
        },
        STUDIO_OFF: {
          target: 'program',
        },
        EXIT: {
          target: 'idle'
        }
      },
    },
    program_toggle: {
      invoke: 
      {
        id: 'disable-studio',
        src: (context, event) => disableStudioMode,
      },
      on: {
        STUDIO_OFF: {
          target: 'program'
        },
      }
    },
    program: {
      on: {
        TOGGLE_STUDIO_ON: {
          target: 'studio_toggle'
        },
        STUDIO_ON: {
          target: 'studio'
        },
        EXIT: {
          target: 'idle'
        }
      },
    },
  }
},{
  services: {
    checkStudioMode: (event, context) => (send, onReceive) => {
      onReceive((event) => {
        console.log('Check studio mode context: ', context);
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
        console.log('Studio mode toggled');
        
        obs.send('DisableStudioMode');
    },
    enableStudioMode: () => (send, onReceive) => {
      onReceive((event) => {
        console.log('Studio mode toggled');
        
        obs.send('EnableStudioMode');
      }); 
    },
    toggleStudioMode: () => (send, onReceive) => {
      onReceive((event) => {
        console.log('Studio mode toggled');
        
        obs.send('ToggleStudioMode');
      });
    }
  }
});

const studioModeService = interpret(studioModeMachine, {devtools: true}).start();

export { studioModeService };