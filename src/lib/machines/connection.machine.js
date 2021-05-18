import { Machine, interpret, forwardTo } from "xstate";
import { obs } from '../services/obs.service.js';

const connectionMachine = Machine({
  id: "connection",
  initial: "inactive",
  states: {
    inactive: { 
      on: { 
        CONNECT: { 
          actions: forwardTo('obs-connect'),
        },
        CONNECTED: "connected",
        CONNECTION_FAILED: "connection_failed",
        AUTHENTICATION_FAILED: "authentication_failed",
      },
      invoke: {
        id: 'obs-connect',
        src: 'obsConnect',
      }
    },
    connected: { 
      on: { 
        DISCONNECT: {
          actions: forwardTo('obs-disconnect'),
        },
        DISCONNECTED: "inactive",
        AUTHENTICATION_FAILED: "authentication_failed",
      } ,
      invoke: {
        id: 'obs-disconnect',
        src: 'obsDisconnect',
      }
    },
    connection_failed: {
      after: {
        3000: {target: "inactive"},
      },
    },
    authentication_failed: {
      after: {
        3000: {target: "inactive"},
      },
    },
  }
},
{
  services: {
    obsConnect: () => (send, onReceive) => {
      onReceive((event) => {
        if(event.type === 'CONNECT') {
          console.log(`address: ${event.address}, password: ${event.password}`);
          obs.connect({address: event.address, password: event.password}).then(() => send('CONNECTED')).catch((error) => {
            if(error.code === 'CONNECTION_ERROR') {
                send('CONNECTION_FAILED');
              }
          });
        }
      });
    }, // obsConnect
    obsDisconnect: () => (send, onReceive) => {
      onReceive((event) => {
        if(event.type === 'DISCONNECT') {
          console.log("Disconnecting...");
          obs.disconnect();
          send('DISCONNECTED');
        }
      });
    }
  }
});

const connectionService = interpret(connectionMachine).start();
export { connectionService };