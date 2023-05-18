const { createMachine, interpret, assign } =  require('xstate');
const { EventEmitter } = require('events');

const defaultContext = {
  lift: false,
  payload: false,
  unloaded: -1,
  landmark: 0,
  tasklink: null,
  blankEdgeLandmarks: [],
  invalidLandmarks: [],
  invalidTransitions: [],
  cornersLandmarks: [],
  dest: null,
  edgeLandmarks: [],
};

const AGVState = createMachine({
  //
  predictableActionArguments: true,
  //
  id: 'agv',
  context: defaultContext,
  type: 'parallel',
  states: {
    processing: {
      initial: 'task_process',
      states: {
        task_process: {
          on: {
            CHANGE: {
              actions: [
                assign({
                  tasklink: (context, event) => {
                    const [ e_task, e_row, e_running ] = event.value;

                    let { value: task } = e_task;
                    task = (typeof task == 'number') ? task : context.tasklink.task;

                    let { value: row } = e_row;
                    row = (typeof row == 'number') ? row : context.tasklink.row;

                    let { value: running } = e_running;
                    running = (typeof running == 'number') ? running : context.tasklink.running;

                    return { ...context.tasklink, task, row, running };
                  }
                })
              ],
            }
          }
        },
      }
    },
    running: {
      initial: 'free',
      states: {
        free: {
          on: {
            REACHED: {
              actions: [
                assign({ landmark: (context, event) => event.value })
              ],
            }
          }
        },
        stay: {
          on: {
            RUN: { target: 'free' }
          }
        },
      }
    },
  }
}, {
  guards: { }
});

class StorageService extends EventEmitter {
  constructor(store, initialContext = null) {
    super();

    this.store = store;
    this.agv = false;

    if (initialContext) { this.setup(initialContext); }
  }

  async setup(initialContext = {}) {
    await this.store.read();

    const {
      initialDest: dest = defaultContext.dest,
      edgeLandmarks = defaultContext.edgeLandmarks,
      payload = defaultContext.payload,
      unloaded = defaultContext.unloaded,
      blankEdgeLandmarks = defaultContext.blankEdgeLandmarks,
      invalidLandmarks = defaultContext.invalidLandmarks,
      invalidTransitions = defaultContext.invalidTransitions,
      forceInitWithAppConfig = false,
      cornersLandmarks = defaultContext.cornersLandmarks,
    } = initialContext;

    let ctx = defaultContext;
    if (this.store.data && this.store.data.context) {
      ctx = {
        ...ctx,
        ...this.store.data.context
      };
      if (forceInitWithAppConfig) {
        ctx = { ...ctx, dest, payload, unloaded, edgeLandmarks, blankEdgeLandmarks, cornersLandmarks, invalidLandmarks, invalidTransitions };
      }
    } else {
      ctx = { ...ctx, dest, payload, unloaded, edgeLandmarks, blankEdgeLandmarks, cornersLandmarks, invalidLandmarks, invalidTransitions };
    }

    this.agv = interpret(AGVState.withContext(ctx));
    this.agv.onTransition((state) => {
      const { changed, value, context, history } = state;

      if (changed) {
        console.info(value, context);

        if (history) {
          this.emit('states', context, history.context);
        }

        console.info(`@${new Date()}\r\n`);
      }
    });

    this.agv.start();
  }

  getContext() {
    return this.agv.getSnapshot().context;
  }
}

module.exports = {
  StorageService
};
