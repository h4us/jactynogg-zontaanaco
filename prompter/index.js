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
  `次の文章を50語以内で日本語でもっと具体的にして: `,
];
let rqInterval = fetchIntervalSleep;

const rq = async (loop = true) => {
  console.log(rqInterval);

  if (rqInterval !== 'skip') {
    try {
      const caption = await got.get(`http://${LAVIS_HOST}:8080`).json();

      let caption_j;

      // chatGPT
      const controller = new AbortController();

      const tc = setTimeout(() => {
        controller.abort();
        console.error('-- timeout gpt');
      }, 7 * 1000);

      const uts = userTextSources.map((el) => `${el} "${caption[0]}"`);
      console.info(uts);

      const messages = [
        {
          "role": "system",
          "content": sample([
            "You are a helpful assistant.",
          ])
        },
        {
          "role": "user",
          "content": sample(uts)
        }
      ];

      console.info(messages);

      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          max_tokens: 100,
          messages
        }, {
          signal: controller.signal,
        });

        console.info('gpt: ', completion.data.choices[0].message.content);

        caption_j = {
          translations: [
            { text: completion.data.choices[0].message.content }
          ]
        };

        clearTimeout(tc);
      } catch (ierr) {
        console.error('gpt response err?', ierr.type, ierr.message);

        // deepL
        caption_j = await got.post('https://api-free.deepl.com/v2/translate', {
          headers: {
            Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`
          },
          form: {
            text: caption[0],
            source_lang: 'EN',
            target_lang: 'JA'
          }
        }).json();

        clearTimeout(tc);
      }

      const { translations = [] } = caption_j;

      // NOTE: send telop and read
      if (translations.length > 0) {
        if (wss.clients.size > 0) {
          wss.clients.forEach((el) => el.send(JSON.stringify([translations[0].text])));
        }

        //! NOTE: reading
        if (speaker) {
          await speaker.speak(translations[0].text);
        }

      } else {
        if (wss.clients.size > 0) {
          wss.clients.forEach((el) => el.send(JSON.stringify(t)));
        }
      }
      // --
    } catch (err) {
      console.error(err.type, err.message);
    }

  }

  // NOTE: wait
  if (typeof rqInterval == 'number') {
    console.log('sleep', rqInterval);
    await sleep(rqInterval);
  } else if (Array.isArray(rqInterval)) {
    const [mode, ...rest] = rqInterval;

    console.log('range?', mode, rest);

    if (mode == 'sample') {
      await sleep(sample(rest));
    } else {
      const [lv, hv] = rest;
      await sleep(random(lv, hv));
    }
  } else if (rqInterval == 'skip') {
    console.log('skip');
  } else {
    console.log('-');
  }

  if (loop) { rq(); }
};

const fastify = Fastify({
  // logger: true
  logger: { level: 'error' },
});

const runApp = async () => {
  fastify
    .register(FastifyNext)
    .after(() => {
      fastify.next('/');
    });

  // NOTE: APIs
  fastify
    .get('/env', (req, reply) => {
      // TODO: response
      reply.send({
        WS_HOST, LAVIS_HOST, MJPEG_STREAMER_HOST, TEXT_POSITION
      });
    })
    .post('/config', (req, reply) => {
      const {
        rqInterval: _rqInterval,
        userTextSources: _userTextSources
      } = JSON.parse(req.body);

      if (_rqInterval) { rqInterval = _rqInterval; }
      if (_userTextSources) {
        console.log(_userTextSources);

        userTextSources = _userTextSources;
      }

      reply.send({ status: 1 });
    });

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
  rq();

  try {
    await fastify.listen({ host: '::', port: 3000 });
  } catch (err) {
    throw err;
  }
};

runApp();
