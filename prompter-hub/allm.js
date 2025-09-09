import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { OBSWebSocket } from 'obs-websocket-js';
import { Server as OSCServer, Client as OSCClient } from 'node-osc';

import got from 'got';

import 'dotenv/config';

import GCPTTSSpeaker from './_speakers/gcptts.js';

// NOTE: .env
const {
  OBS_HOST = false,
  LM_STUDIO_HOST = 'ws://0.0.0.0:1234',
  ANYTHINGLLM_HOST = 'http://0.0.0.0:3001',
  ANYTHINGLLM_APIKEY = '',
  ANYTHINGLLM_TARGET_WORKSPACE = '',
  ANYTHINGLLM_TARGET_THREAD = false,
  //
  ANYTHINGLLM_APIKEY_REMOTE,
  ANYTHINGLLM_HOST_REMOTE,
  ANYTHINGLLM_TARGET_WORKSPACE_REMOTE,
  ANYTHINGLLM_TARGET_THREAD_REMOTE
} = process.env;

let pInfo = false;
let targetThread = false;
let counts = 0;
let obs = false;
let obsConnected = false;

const oscServer = new OSCServer(9999, '0.0.0.0');
const oscClient = new OSCClient('0.0.0.0', 12000);

const speaker = new GCPTTSSpeaker();

const got_cl = got.extend({
  hooks: {
    beforeRequest: [
      options => {
        options.headers['Authorization'] = 'Bearer ' + ANYTHINGLLM_APIKEY;
      }
    ]
  }
});

const allmConfigRequest = async (target) => {
  const { ALLM_APIKEY, ALLM_HOST, ALLM_WORKSPACE, ALLM_THREAD } = target;
  let targetThread = {};
  let counts = 0;

  const got_cl = got.extend({
    hooks: {
      beforeRequest: [
        options => {
          options.headers['Authorization'] = 'Bearer ' + ALLM_APIKEY;
        }
      ]
    }
  });

  const pInfo = await got_cl.get(`${ALLM_HOST}/api/v1/workspaces`, {
    responseType: 'json',
  }).json().catch(error => {
    console.error(error);
  });

  if (pInfo.workspaces) {
    const [ws_first, ...ws_rest] = pInfo.workspaces.filter((el) => el.slug == ALLM_WORKSPACE);
    console.info('found workspace: ', ws_first);
    console.info('found threads: ', ws_first.threads);

    if (ALLM_THREAD) {
      const ti = ws_first.threads.findIndex((el) => el.name == ALLM_THREAD);
      targetThread = ws_first.threads[(ti > 0) ? ti : 0];
    } else {
      targetThread = ws_first.threads[0];
    }
  }

  let test_ret = await got_cl.get(`${ALLM_HOST}/api/v1/workspace/${ALLM_WORKSPACE}/thread/${targetThread.slug}/chats`, {
    responseType: 'json',
  }).json().catch(error => {
    console.error(error);

    return false;
  });

  if (test_ret && test_ret['history']) {
    const [h1, ...h_rest] = test_ret['history'];
    console.info(`thread <${targetThread.name}> start with.. `, h1);
    if (h_rest && h_rest.length > 0) {
      //
      counts = test_ret['history'].length;
      //
      console.info(`..end @${counts}, with `, h_rest.pop());
    }
  }

  return {
    ALLM_HOST,
    ALLM_WORKSPACE,
    ALLM_THREAD_SLUG: targetThread.slug,
    counts,
    client: got_cl
  };
};


const allmChatRequest = async (target, chat, imgs = [], reset = false) => {
  console.info(target);

  const { client, ALLM_HOST, ALLM_WORKSPACE, ALLM_THREAD_SLUG } = target;
  const jsonData = {
    'message': chat,
    'mode': "chat",
    // "userId": 1,
    'reset': reset
  };

  if (imgs.length > 0) {
    jsonData.attachments = imgs.map((el, i) => {
      return {
        'name': `image-${i}.jpg`,
        'mime': 'image/jpeg',
        'contentString': el
      };
    });
  }

  return await client.post(
    `${ALLM_HOST}/api/v1/workspace/${ALLM_WORKSPACE}/thread/${ALLM_THREAD_SLUG}/chat`,
    {
      responseType: 'json',
      json: jsonData
    }).json().catch(error => {
      return error;
    });
};


const main = async () => {
  if (OBS_HOST) {
    obs = new OBSWebSocket();

    await obs.disconnect();
    obsConnected = await obs.connect(OBS_HOST).catch((err) => { console.error(err); return false; });

    // const obsv = await obs.call('GetVersion');
  }

  //
  await mkdir(resolve('./tmp')).catch(_ => false);
  await mkdir(resolve('./tmp_text')).catch(_ => false);
  await mkdir(resolve('./tmp_audio')).catch(_ => false);

  //
  await speaker.setup(oscClient);

  // --
  // pInfo = await got_cl.get(`${ANYTHINGLLM_HOST}/api/v1/auth`, {
  //   responseType: 'json',
  // }).json().catch(error => {
  //   console.error(error);
  // });
  // console.log('/auth', pInfo);

  const localConfig = await allmConfigRequest({
    ALLM_APIKEY: ANYTHINGLLM_APIKEY,
    ALLM_HOST: ANYTHINGLLM_HOST ,
    ALLM_WORKSPACE: ANYTHINGLLM_TARGET_WORKSPACE,
    ALLM_THREAD: ANYTHINGLLM_TARGET_THREAD
  });

  // -- remote
  console.log('remote-config!');

  const remoteConfig = await allmConfigRequest({
    ALLM_APIKEY: ANYTHINGLLM_APIKEY_REMOTE,
    ALLM_HOST: ANYTHINGLLM_HOST_REMOTE,
    ALLM_WORKSPACE: ANYTHINGLLM_TARGET_WORKSPACE_REMOTE,
    ALLM_THREAD: ANYTHINGLLM_TARGET_THREAD_REMOTE
  });
  // --

  oscServer.on('error', async (e) => {
    console.error('err!', e);
    return 1;
  });

  oscServer.on('message', async (e) => {
    const [addr, ...data] = e;
    const fname = `${Date.now()}.jpg`;
    let res = false;
    let toFile = false;

    if (addr == '/capture') {
      if (OBS_HOST && obs) {
        res = await obs.call('GetSourceScreenshot', {
          imageFormat: 'jpeg',
          sourceName: data[0],
          // sourceUuid: '',
          // imageWidth: '',
          // imageHeight: '',
        }).catch(_ => false);

        if (res !== false) {
          toFile = await writeFile(
            resolve('./tmp', fname),
            Buffer.from(res.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
          ).catch(_ => false);
        }

        console.log('capture done');
      }

      if (res !== false) {
        // -- TODO: multi head
        const rres = await allmChatRequest(
          localConfig,
          // counts < 1 ? '実況してください。' : '続きを実況してください。',
          '指示に基づいて現在の場面を実況してください。',
          // '現在の場面について説明しなさい。',
          // '現在の画像に写っているものを列挙しなさい。',
          [res.imageData],
          (counts == 0)
          // true
        );

        if (rres && rres.type == 'textResponse') {
          console.info(rres);

          const content = rres[rres.type];
          console.log(content);

          // TODO:
          writeFile(
            resolve('./tmp_text', 'caption1.txt'), content
          ).catch(_ => false);

          if (speaker) { speaker.speak(content); }
          // await got.get(`http:localhost:3000/speak?msg=${lines[0]}`, {}).json().catch(_ => false);

          oscClient.send('/done', data[0]);
        }

        console.info('-- ', counts);

        counts ++;
        // --
      }
    }

    //
  });
};

main();
