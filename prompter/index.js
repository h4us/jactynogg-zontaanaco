import { setTimeout as sleep } from 'timers/promises';

import Fastify from 'fastify';
import * as FastifyNext from '@fastify/nextjs';
import { Server, Client } from 'node-osc';
import { WebSocketServer } from 'ws';
import got from 'got';
import sample from 'lodash.sample';
import random from 'lodash.random';
import { Configuration, OpenAIApi } from 'openai';

import TextToSpeech from '@google-cloud/text-to-speech';
const client = new TextToSpeech.TextToSpeechClient();

import 'dotenv/config';

// NOTE: .env
const {
  LAVIS_HOST, WS_HOST,  MJPEG_STREAMER_HOST,
  OPENAI_API_KEY, DEEPL_API_KEY,
  SPEAKER_TYPE, TEXT_POSITION
} = process.env;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

import appConfig  from './app.config.js';
const { fetchIntervalSleep } = appConfig;

// NOTE: speakers
import PuppeteerSpeaker from './speakers/puppeteer.js';
import GCPTTSSpeaker from './speakers/gcptts.js';

// NOTE:
const oscs = new Server(9999, '0.0.0.0');
const wss = new WebSocketServer({
  port: 3001,
  clientTracking: true
});

// NOTE:
let speaker;
let userTextSources = [
  `文中の名詞を日本語に変換してリストにしてください。英語は除外してください: `,
];
let rqInterval = fetchIntervalSleep;
let lavisEndpoint = '';

const fastify = Fastify({
  // logger: true
  logger: { level: 'error' },
});

const runApp = async () => {
  // fastify
  //   .register(FastifyNext)
  //   .after(() => {
  //     fastify.next('/');
  //   });

  // NOTE: APIs
  fastify
    // .get('/env', (req, reply) => {
    //   reply.send({
    //     WS_HOST, LAVIS_HOST, MJPEG_STREAMER_HOST, TEXT_POSITION
    //   });
    // })
    .get('/abort', (req, reply) => {
      if (speaker) {
        console.log('abort spaker');
        speaker.abort();
      }
      reply.send({ status: 'aborted' });
    })
    .get('/speak', (req, reply) => {
      const { query = {} } = req;
      const { msg = '' } = query;

      if (speaker) {
        speaker.speak(msg);
      }

      reply.send({ status: 1 });
    })
    .post('/speak', (req, reply) => {
      const {
        rqInterval: _rqInterval,
        userTextSources: _userTextSources,
        lavisEndpoint: _lavisEndpoint
      } = JSON.parse(req.body);

      if (speaker) {
        speaker.speak('test');
      }

      reply.send({ status: 1 });
    });
    // .post('/config', (req, reply) => {
    //   const {
    //     rqInterval: _rqInterval,
    //     userTextSources: _userTextSources,
    //     lavisEndpoint: _lavisEndpoint
    //   } = JSON.parse(req.body);

    //   if (_rqInterval) {
    //     console.info('set config', _rqInterval);
    //     rqInterval = _rqInterval;
    //   }

    //   if (_userTextSources) {
    //     console.info('set config', _userTextSources);
    //     userTextSources = _userTextSources;
    //   }

    //   if (_lavisEndpoint && (typeof _lavisEndpoint == 'string')) {
    //     console.info('set config', _lavisEndpoint);
    //     lavisEndpoint = _lavisEndpoint;
    //   }

    //   reply.send({ status: 1 });
    // });

  // NOTE: speaker
  if (SPEAKER_TYPE == 'gcp-tts') {
    speaker = new GCPTTSSpeaker();
  } else {
    speaker = new PuppeteerSpeaker();
  }
  await speaker.setup();

  // NOTE: OSC
  oscs.on('message', (msg) => {
    const [tag, data] = msg;

    if (tag == '/interval') {
      rqInterval = data;

      if ((Array.isArray(data) && data.findIndex((el) => (typeof el !== 'number') == -1)) ||
        (typeof data == 'number') ||
        (data === 'skip')) {
        userTextSources = data;
      }
    } else if (tag == '/speaker') {
      //
    } else if (tag == '/gpt') {
      if (Array.isArray(data)) { userTextSources = data; }
    }
  });

  // NOTE: start loop
  // rq();

  try {
    await fastify.listen({ host: '::', port: 3000 });
  } catch (err) {
    throw err;
  }
};

runApp();
