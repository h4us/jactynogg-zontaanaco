const  { Client } = require('node-osc');

module.exports = function (fastify, opts, done) {
  let oscClient = false;

  if (fastify.appconfig) {
    const { OSCDest } = fastify.appconfig;
    if (OSCDest) {
      oscClient = new Client(OSCDest, 9999);
    }
  }

  fastify.agvbridge
    .on('status', (message) => {
      if (message.path == '/state/taskMonitor') {
        if (Array.isArray(message.data)) {
          const data = message.data.map((el) => el.value);
          if (oscClient && data.indexOf(undefined) == -1 && data.findIndex((el) => typeof el !== 'number') == -1) {
            console.log(data);
            oscClient.send('/task', data);
          }
        }
      }
      if (message.path == '/state/landmarkHistoryRecord') {
        if (oscClient && message.data.indexOf(undefined) == -1 && message.data.findIndex((el) => typeof el !== 'number') == -1) {
          console.log(message.data);
          oscClient.send('/landmark', message.data);
        }
      }

      // NOTE: notify to all of browser clients, for monitoring
      if (fastify.websocketServer.clients.size > 0) {
        fastify.websocketServer.clients.forEach((el) => {
          el.send(JSON.stringify(message));
        });
      }
    });

  fastify
    .get('/', { websocket: true }, (connection, req) => {
      connection.socket.on('open', (e) => {
        console.log('open', e);
      });
      connection.socket.on('close', (e) => {
        console.log('close', e);
      });
      connection.socket.on('message', (e) => {
        const data_json = JSON.parse(e.toString());
        const { path = '', data } = data_json;

        if (path == '/xstate') {
          if (fastify.agvbridge.service) {
            connection.socket.send(JSON.stringify({
              path: '/state/xstate',
              data: [fastify.agvbridge.service.getContext()]
            }));
          }
        }
      });
    });

  done();
};
