import { Machine, interpret, forwardTo } from "xstate";
import { obs } from "../services/obs.service";

const switchMachine = Machine({
  id: 'switch',
  initial: 'idle',
  states: {
    idle: {
      on: {
        PUSH: {
          actions: forwardTo('obs-push'),
        },
      },
      invoke: {
        id: 'obs-push',
        src: 'obsPush',
      },
    },
  },
},{
  services: {
    obsPush: () => (send, onReceive) => {
      onReceive((event) => {
        obs.send('GetStudioModeStatus')
        .then((data) => {
          if(data.studioMode) {
            obs.send('GetPreviewScene')
            .then((data) => {
              if(data.name === event.name) {
                obs.send('TransitionToProgram');
                send('PROGRAM');
              }else {
                obs.send('SetPreviewScene', {"scene-name": event.name});
                send('PREVIEW');
              }
            }).catch((error) => {
              console.error(error);
            });
          } else {
            obs.send('SetScene', {"scene-name": event.name})
            send('PROGRAM');
          }
        })
        .catch((error) => error);
      });
    }
  },
});

const switchService = interpret(switchMachine).start();
export { switchService };