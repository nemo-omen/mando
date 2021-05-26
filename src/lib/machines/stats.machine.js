import { Machine, interpret, assign } from "xstate";
import { stats, obs } from '../services/obs.service.js';

const statsMachine = Machine({
  id: 'stats',
  initial: 'idle',
  context: {
    stats: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        POLL: {target: 'active'},
      }
    },
    active: {
      activities: ['polling'],
      on: {
        STOP_POLLING: {target: 'idle'}
      }
    }
  }
},
{
  activities: {
    polling: (context, event) => {
      const interval = setInterval(async () => {
        const data = await obs.send('GetStats');
        if(!data.error) {
          const statsData = await data.stats;
          context.stats = await statsData;
          stats.set(await statsData);
        }else {
          context.error = data.error;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }
});

const statsService = interpret(statsMachine).start();

export { statsService };