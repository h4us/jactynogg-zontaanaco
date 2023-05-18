module.exports = function (fastify, opts, done) {
  /*
   * controls
   */
  fastify
    .get('/', async (req, reply) => { return {}; })
    .post('/state', async (req, reply) => {
      const { data = 0 } = req.body;
      fastify.agvbridge.watchStatus(data);
      return { done: true, data };
    })
    .post('/mode', async (req, reply) => {
      const { data = 0 } = req.body;
      return await fastify.agvbridge.setMode(data);
    })
    .get('/remotecall/:type/:target', async (req, reply) => {
      const { type, target } = req.params;
      return await fastify.agvbridge.remoteCall(type, target);
    })
    .get('/start', async (req, reply) => {
      return await fastify.agvbridge.start();
    })
    .get('/stop', async (req, reply) => {
      return await fastify.agvbridge.stop();
    })
    .get('/reset', async (req, reply) => {
      return await fastify.agvbridge.reset();
    });

  /*
   *  Script API
   */
  fastify
    .get('/script', async (req, reply) => {
      const { query = {} } = req;
      const { preset = false } = query;

      if (preset) {
        return await fastify.agvbridge.loadScriptFromPreset(preset);
      } else {
        return await fastify.agvbridge.uploadScript();
      }
    })
    .get('/script/sample', async (req, reply) => {
      return await fastify.agvbridge.downloadScript(false, true);
    })
    .post('/script', async (req, reply) => {
      const { body: data = '', query = {} } = req;
      const { file: ff } = query;

      if (ff) {
        const fdata = await req.file();
        const fbuf = await fdata.toBuffer();
        return fastify.agvbridge.loadScriptFromFile(fbuf);
      } else {
        return await fastify.agvbridge.downloadScript(data);
      }
    });

  /*
   * Tasks API
   */
  fastify
    .get('/tasks', async (req, reply) => {
      const { query = {} } = req;
      const { preset = false } = query;

      let ret;

      if (preset) {
        ret = await fastify.agvbridge.loadTasksFromPreset(preset);
      } else {
        ret = await fastify.agvbridge.uploadTasks();
      }

      return ret;
    })
    .post('/tasks', async (req, reply) => {
      const { body: data = '', query = {} } = req;
      const { file: ff, template: tt } = query;

      if (ff) {
        const fdata = await req.file();
        const fbuf = await fdata.toBuffer();
        return fastify.agvbridge.loadTasksFromFile(fbuf);
      } else if (tt) {
        return await fastify.agvbridge.writeTasksAsTemplate(data);
      } else {
        return await fastify.agvbridge.downloadTasks(data);
      }
    })
    .get('/tasks/sample', async (req, reply) => {
      return await fastify.agvbridge.downloadTasks(false, true, true);
    })
    .get('/tasks/instructions', async (req, reply) => {
      return fastify.agvbridge.getTaskInstructions();
    });

  done();
};
