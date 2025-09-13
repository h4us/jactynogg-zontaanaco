import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { OBSWebSocket } from 'obs-websocket-js';
import { Server as OSCServer, Client as OSCClient } from 'node-osc';

import got from 'got';
import { DateTime } from 'luxon';

import 'dotenv/config';

import GCPTTSSpeaker from './_speakers/gcptts.js';
import CaptionMaker from './_tools/captionmaker.js';
import CaptureMaker from './_tools/capturemaker.js';

// NOTE: .env
const {
  OBS_HOST = false,
  PROXYBACK_HOST = 'http://0.0.0.0:7777',
  LM_STUDIO_HOST = 'ws://0.0.0.0:1234',
  ANYTHINGLLM_HOST = false,
  ANYTHINGLLM_APIKEY = '',
  ANYTHINGLLM_TARGET_WORKSPACE = '',
  ANYTHINGLLM_TARGET_THREAD = false,
  //
  ANYTHINGLLM_HOST_REMOTE = false,
  ANYTHINGLLM_APIKEY_REMOTE,
  ANYTHINGLLM_TARGET_WORKSPACE_REMOTE,
  ANYTHINGLLM_TARGET_THREAD_REMOTE,
  //
  CAPTURE_SRC_LOCAL = '',
  CAPTURE_SRC_REMOTE = '',
  //
  OSC_RECV_PORT = 9999,
  ENABLE_SPEAKER = 1
} = process.env;

let counts = 0;
let obs = false;
let obsConnected = false;

const oscServer = new OSCServer(parseInt(OSC_RECV_PORT), '0.0.0.0');
const oscClient = new OSCClient('0.0.0.0', 12000);

const speaker = new GCPTTSSpeaker();

const agvCaptionMaker = new CaptionMaker();
const segwayCaptionMaker = new CaptionMaker();

const agvCaptureMaker = new CaptureMaker();
const segwayCaptureMaker = new CaptureMaker();

const allmConfigRequest = async (target) => {
  const { ALLM_APIKEY, ALLM_HOST, ALLM_WORKSPACE, ALLM_THREAD } = target;
  let targetThread = false;
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

    return false;
  });

  if (pInfo && pInfo.workspaces) {
    const [ws_first, ...ws_rest] = pInfo.workspaces.filter((el) => el.slug == ALLM_WORKSPACE);
    console.info('found workspace: ', ws_first);
    console.info('found threads: ', ws_first.threads);

    if (ALLM_THREAD) {
      const ti = ws_first.threads.findIndex((el) => el.name == ALLM_THREAD);
      targetThread = ws_first.threads[(ti < 0) ? 0 : ti];
    } else {
      targetThread = ws_first.threads[0];
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
        counts = test_ret['history'].length;
        console.info(`..end @${counts}, with `, h_rest.pop());
      }
    }
  }

  return targetThread ? {
    ALLM_HOST,
    ALLM_WORKSPACE,
    ALLM_THREAD_SLUG: targetThread.slug,
    counts,
    client: got_cl
  } : {};
};


const allmChatRequest = async (target, chat, imgs = [], reset = false) => {
  const { client, ALLM_HOST, ALLM_WORKSPACE, ALLM_THREAD_SLUG } = target;

  console.log(ALLM_HOST, ALLM_WORKSPACE, ALLM_THREAD_SLUG);

  const jsonData = {
    'message': chat,
    'mode': "chat",
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
  await mkdir(resolve('./tmp_audio')).catch(_ => false);
  // await mkdir(resolve('./tmp_text')).catch(_ => false);

  //
  if (parseInt(ENABLE_SPEAKER) == 1) await speaker.setup(oscClient);

  await agvCaptionMaker.setup(obs, {
    captionName1: 'caption-2',
    captionName2: 'caption-2-alt',
    captionName3: 'caption-2-opt'
  });
  await segwayCaptionMaker.setup(obs);

  await agvCaptureMaker.setup(obs, { captureName: 'capture-2' });
  await segwayCaptureMaker.setup(obs);

  // -- local
  const localConfig = await allmConfigRequest({
    ALLM_APIKEY: ANYTHINGLLM_APIKEY,
    ALLM_HOST: ANYTHINGLLM_HOST ,
    ALLM_WORKSPACE: ANYTHINGLLM_TARGET_WORKSPACE,
    ALLM_THREAD: ANYTHINGLLM_TARGET_THREAD
  });

  // -- remote
  const remoteConfig = await allmConfigRequest({
    ALLM_APIKEY: ANYTHINGLLM_APIKEY_REMOTE,
    ALLM_HOST: ANYTHINGLLM_HOST_REMOTE,
    ALLM_WORKSPACE: ANYTHINGLLM_TARGET_WORKSPACE_REMOTE,
    ALLM_THREAD: ANYTHINGLLM_TARGET_THREAD_REMOTE
  });

  console.log('stettings: ', parseInt(OSC_RECV_PORT), parseInt(ENABLE_SPEAKER));

  oscServer.on('error', async (e) => {
    console.error('err!', e);
    return -1;
  });

  oscServer.on('message', async (e) => {
    const [addr, ...data] = e;
    let res = false;
    let toFile = false;

    // console.log(addr);

    if (/^\/speak_end\/.*/.test(addr)) {
      console.log('uncapture', addr);
      if (addr == '/speak_end/agv') agvCaptureMaker.uncapture();
      if (addr == '/speak_end/segway') segwayCaptureMaker.uncapture();
    }

    if (addr == '/flush_text') {
      await writeFile(resolve('./tmp_text', 'caption1-alt.txt'), '').catch(_ => false);
      await writeFile(resolve('./tmp_text', 'caption1.txt'), '').catch(_ => false);
      await writeFile(resolve('./tmp_text', 'caption2-alt.txt'), '').catch(_ => false);
      await writeFile(resolve('./tmp_text', 'caption2.txt'), '').catch(_ => false);
    }

    if (addr == '/capture') {
      const fname = `${Date.now()}.jpg`;
      const rpath = resolve('./tmp', fname);

      if (OBS_HOST && obs) {
        res = await obs.call('GetSourceScreenshot', {
          imageFormat: 'jpeg',
          sourceName: data[0],
          // TODO: size options
          // imageWidth: '', imageHeight: '',
        }).catch(_ => false);

        if (res !== false) {
          toFile = await writeFile(
            rpath,
            Buffer.from(res.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
          ).catch(_ => false);
        }

        console.log('capture done', data[0], DateTime.now().toString());
      }

      if (res !== false) {
        if (CAPTURE_SRC_LOCAL == data[0]) {
          segwayCaptureMaker.capture(rpath);

          const rres = await allmChatRequest(
            localConfig,
            // '現在の画像に写っているものを列挙しなさい。',
            // 'コンテキストに基づいて現在の場面の実況テキストを作成しなさい。',
            // 'Create text for the current scene based on the context.',
            // 'Describe the current scene',
            'Describe the current scene, only nuon and adjective or person\'s name.',
            [res.imageData],
            (localConfig.counts == 0)
          );

          if (rres && rres.type == 'textResponse') {
            console.info(rres);

            let content = rres[rres.type];
            console.log(content);

            try {
              // const [en_c, ch_c = ''] = content.split('|');
              // content = content.replace(/[\r\n]/g, '');
              // const en_c = content.replace(/^.*en\{(.*)\}\|.*$/, '$1');
              // const ch_c = content.replace(/^.*\|ch\{(.*)\}.*$/, '$1');

              let en_c = content.match(/en:([^\r\n]+)[\r\n]/g);
              let ch_c = content.match(/tw:([^\r\n]+)[\r\n]/g);
              let ja_c = content.match(/ja:([^\r\n]+)[\r\n].*$/g);

              en_c = (en_c && en_c.length > 0) ? en_c[0] : '';
              en_c = en_c.replace(/^en:/, '');
              ch_c = (ch_c && ch_c.length > 0) ? ch_c[0] : '';
              ch_c = ch_c.replace(/^tw:/, '');
              ja_c = (ja_c && ja_c.length > 0) ? ja_c[0] : '';
              ja_c = ja_c.replace(/^ja:/, '');

              segwayCaptionMaker.make(ch_c, en_c, ja_c);

              if (speaker) { speaker.speak(ch_c); }

              oscClient.send('/done', data[0]);
            } catch (err) {
              console.error(err);
            }
          }

          console.info('-- local -- ', localConfig.counts, DateTime.now().toString());
          localConfig.counts++;
        }

        if (CAPTURE_SRC_REMOTE == data[0]) {
          agvCaptureMaker.capture(rpath);

          const rres = await allmChatRequest(
            remoteConfig,
            // 'コンテキストに基づいて現在の場面の実況テキストを作成しなさい。',
            // 'Create text for the current scene based on the context.',
            'Describe the current scene',
            // 'Describe the current scene, shorter sentence.',
            // 'Describe what\'s happen in the image? Explain it in words that a sixth grader can understand.',
            [res.imageData],
            (remoteConfig.counts == 0)
          );

          if (rres && rres.type == 'textResponse') {
            console.info(rres);

            let content = rres[rres.type];
            console.log(content);

            try {
              // let [en_c = ''] = content.match(/en:\{([^}]+)\}/g);
              // let [ch_c = ''] = content.match(/tw:\{([^}]+)\}/g);
              // let [ja_c = ''] = content.match(/ja:\{([^}]+)\}/g);

              // en_c = en_c.replace(/(en:\{)|(\})/g, '');
              // ch_c = ch_c.replace(/(tw:\{)|(\})/g, '');
              // ja_c = ja_c.replace(/(ja:\{)|(\})/g, '');

              let en_c = content.match(/en:([^\r\n]+)[\r\n]/g);
              let ch_c = content.match(/tw:([^\r\n]+)[\r\n]/g);
              let ja_c = content.match(/ja:([^\r\n]+)[\r\n]*/g);

              console.log('--', `${en_c} | ${ch_c} | ${ja_c}`);

              en_c = (en_c && en_c.length > 0) ? en_c[0] : '';
              en_c = en_c.replace(/^en:/, '');
              ch_c = (ch_c && ch_c.length > 0) ? ch_c[0] : '';
              ch_c = ch_c.replace(/^tw:/, '');
              ja_c = (ja_c && ja_c.length > 0) ? ja_c[0] : '';
              ja_c = ja_c.replace(/^ja:/, '');

              agvCaptionMaker.make(ch_c, en_c, ja_c);

              await got.post(
                `${PROXYBACK_HOST}/speak`,
                {
                  responseType: 'json',
                  json: { content: ch_c }
                }).json().catch(error => {
                  return error;
                });
            } catch (err) {
              console.error('parse error, skip..');

              return;
            }
          }

          console.info('-- remote -- ', remoteConfig.counts, DateTime.now().toString());
          remoteConfig.counts++;
        }
        // --
      }
    }

    //
  });
};

main();
