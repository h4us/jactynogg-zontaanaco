import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { OBSWebSocket } from 'obs-websocket-js';
import { Server as OSCServer, Client as OSCClient } from 'node-osc';

import 'dotenv/config';

// NOTE: .env
const {
  OBS_HOST = 'http://0.0.0.0:4455',
} = process.env;

const obs = new OBSWebSocket();
let obsConnected = false;

const oscServer = new OSCServer(9999, '0.0.0.0');
const oscClient = new OSCClient('0.0.0.0', 12000);

let pInfo = false;
let targetThread = false;

const main = async () => {
  await obs.disconnect();

  obsConnected = await obs.connect(OBS_HOST).catch((err) => { console.error(err); return false; });

  const obsv = await obs.call('GetVersion');

  await mkdir(resolve('./tmp_test')).catch(_ => false);

  oscServer.on('message', async (e) => {
    const [addr, ...data] = e;
    const fname = `${Date.now()}.jpg`;
    let res = false;
    let toFile = false;

    if (addr == '/capture') {
      res = await obs.call('GetSourceScreenshot', {
        imageFormat: 'jpeg',
        sourceName: data[0],
        // sourceUuid: '',
        // imageWidth: '',
        // imageHeight: '',
      }).catch(_ => false);

      if (res !== false) {
        toFile = await writeFile(
          resolve('./tmp_test', fname),
          Buffer.from(res.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        ).catch(_ => false);
      }

      console.log('capture done');
      oscClient.send('/done', 1);
    }
  });
};

main();
