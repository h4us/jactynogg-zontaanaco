/**  @type {import('fastify').FastifyInstance} */

const { resolve } = require('path');
const { readdir, readFile, writeFile, stat } = require('fs').promises;
const { exec } = require('child_process');

const fastify = require('fastify')({
  logger: { level: 'error' },
  pluginTimeout: 0,
});
const Next = require('next');

const { createBridge } = require('./agv');
const { version } = require('./package');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = Next({ dev });
const handle = app.getRequestHandler();
const handleUpgrade = app.getUpgradeHandler();

let appConfig = require('./app.config');

const runApp = async () => {
  /*
   * Set timezone
   */
  process.env.TZ = 'Asia/Tokyo';

  /*
   * lowdb JSON stores setup
   */
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');
  const presetsAdapter = new JSONFile(resolve('./stores', 'presets.json'));
  const presetsStore = new Low(presetsAdapter);
  const statesAdapter = new JSONFile(resolve('./stores', 'states.json'));
  const statesStore = new Low(statesAdapter);

  /*
   * p-queue
   */
  const { default: PQueue } = await import('p-queue');
  const pq = new PQueue({ concurrency: 1, timeout: 10_000, throwOnTimeout: true });

  /*
   *
   */
  const ustat = await stat(resolve(__dirname, 'user.config.js')).catch(_ => false);
  if (ustat) {
    const { default: userConfig } = await import('./user.config.js');
    appConfig = { ...appConfig, ...userConfig };
  }

  /*
   * create AGV controller instance
   */
  const agvBridge = createBridge({ presetsStore, statesStore }, pq, appConfig);
  fastify.decorate('agvbridge', agvBridge);
  fastify.decorate('appconfig', appConfig);

  /*
   * prepare Fastify instance
   */
  fastify
    .register(require('@fastify/multipart'))
    .register(require('./fastify-websocket'), {
      nextjsUpgradeHandler: handleUpgrade,
      options: {
        clientTracking: true
      }
    })
    .register((fastify, opts, next) => {
      /*
       * prepare NextJS routes
       */
      app
        .prepare()
        .then(() => {
          if (dev) {
            fastify.get('/_next/*', (req, reply) => {
              return handle(req.raw, reply.raw).then(() => {
                reply.hijack();
              });
            });
          }

          const nextjsPaths = [
            '/script', '/tasks', '/hooks'
          ];
          for (let n of nextjsPaths) {
            fastify
              .get(n, (req, reply) => {
                return app.render(req.raw, reply.raw, n, req.query).then(() => {
                  reply.hijack();
                });
              });
          }

          fastify.all('/*', (req, reply) => {
            return handle(req.raw, reply.raw).then(() => {
              reply.hijack();
            });
          });

          fastify.setNotFoundHandler((request, reply) => {
            return app.render404(request.raw, reply.raw).then(() => {
              reply.hijack();
            });
          });

          next();
        })
        .catch((err) => next(err));
    });

  /*
   * prepare API endpoints
   */
  let endpoints = await readdir(resolve('./api'));
  endpoints = endpoints
    .filter((ep) => /.*\.js$/.test(ep))
    .map((ep) => ep.replace(/([\/\\]*)([a-zA-Z0-9_]+)\.js$/, '/$2'));

  for (let prefix of endpoints) {
    fastify.register(require(`./api${prefix}`), { prefix });
  }

  /*
   * utils
   */
  fastify
    .get('/app', async (req, reply) => {
      const { query = {} } = req;
      const { raw, origin = false } = query;
      // ...
      if (raw) {
        const acf = await readFile(resolve(__dirname, 'app.config.js')).catch(_ => false);
        const ucf = await readFile(resolve(__dirname, 'user.config.js')).catch(_ => false);

        return { version, appConfig: ((ucf && !origin) ? ucf.toString() : acf.toString()) };
      } else {
        return { version, appConfig };
      }
    });

  // ...
  try {
    await fastify.listen({ host: '::', port });
  } catch (err) {
    throw err;
  }

  console.info(`Started server on port ${port}`);
};

runApp();
