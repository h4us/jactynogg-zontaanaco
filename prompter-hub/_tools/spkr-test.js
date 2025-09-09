import 'dotenv/config';

import Fastify from 'fastify';

import GCPTTSSpeaker from '../_speakers/gcptts.js';

import { Client as OSCClient } from 'node-osc';

// NOTE: .env
// const {
// } = process.env;

const speaker = new GCPTTSSpeaker();
const oscClient = new OSCClient('0.0.0.0', 12000);

const main = async () => {
  await speaker.setup(oscClient);

  // await speaker.speak('test message 1 2 3');

  const fastify = Fastify({
    logger: { level: '' },
    ignoreTrailingSlash: true,
    pluginTimeout: 0,
  });

  fastify
    .after(() => {
      // fastify
      //   .get('/', { websocket: true }, (connection, req) => {
      //     // console.info('new request: ', connection, req);
      //     // connection.socket.on('message', message => {
      //     //   connection.socket.send('hi from wildcard route');
      //     // });
      //     fastify.websocketServer.clients.forEach((el) => {
      //       el.send(JSON.stringify({ type: 'notify', data: { timestamp: new Date() } }));
      //     });
      //   });

      // - API: POST
      fastify
        .post('/speak', async (req, reply) => {

          const { body = {} } = req;
          const { content = ''} = body;

          console.log(body);

          await speaker.speak(content);

          return {
            status: 1
          };
        });
        // .post('/push-remote', async (req, reply) => {
        //   return {
        //     type: 'requested',
        //     data: {}
        //   };
        // });
    });

  // ...
  try {
    await fastify.listen({ host: '::', port: 7777 });
  } catch (err) {
    throw err;
  }

};

main();
