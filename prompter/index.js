import { setTimeout as sleep } from 'timers/promises';

import Fastify from 'fastify';
import * as FastifyNext from '@fastify/nextjs';
import PQueue from 'p-queue';
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
  SPEAKER_TYPE
} = process.env;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

import appConfig  from './app.config.js';
const { fetchIntervalSleep } = appConfig;

// NOTE: speakers
import PuppeteerSpeaker from './speakers/puppeteer.js';
import GCPTTSSpeaker from './speakers/gcptts.js';

const oscServer = new Server(9990, '0.0.0.0');

const wss = new WebSocketServer({
  port: 3001,
  clientTracking: true
});

let speaker;

const rq = async (loop = true) => {
  try {
    const caption = await got.get(`http://${LAVIS_HOST}:8080`).json();

    let caption_j;

    // chatGPT
    const controller = new AbortController();

    const tc = setTimeout(() => {
      controller.abort();
      console.error('-- timeout gpt');
    }, 7 * 1000);

    const messages = [
      {
        "role": "system",
        "content": sample([
          "You are a helpful assistant.",
          // "You are an artist"
        ])
      },
      {
        "role": "user",
        "content": sample([
          `次の文章を60語以内で日本語でもっと具体的にして: "${caption[0]}"`,
          // `次の文章を日本語でもっと悲しくして: "${caption[0]}"`,
          `次の文章を60語以内で日本語でもっと楽しくして: "${caption[0]}"`,
          // `次の単語を使った詩を日本語で書いて: "${en}"`,
          // `次の文章の続きを日本語で書いて: "${en}"`
        ])
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
    } catch (err) {
      console.error('gpt response err?', err.type);

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

      //! reading
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
    console.error(err.message);
  }

  // NOTE: wait
  if (typeof fetchIntervalSleep == 'number') {
    console.log('sleep', fetchIntervalSleep);
    await sleep(fetchIntervalSleep);
  } else if (Array.isArray(fetchIntervalSleep)) {
    const [lv, hv] = fetchIntervalSleep;
    console.log('range?', lv, hv);
    await sleep(random(lv, hv));
  } else {
    console.log('--');
  }

  if (loop) { rq(); }
};

const qq = new PQueue({ concurrency: 1 });

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
        WS_HOST, LAVIS_HOST, MJPEG_STREAMER_HOST
      });
    })
    .post('/config', (req, reply) => {

    });

  // NOTE: speaker
  if (SPEAKER_TYPE == 'gcp-tts') {
    speaker = new GCPTTSSpeaker();
  } else {
    speaker = new PuppeteerSpeaker();
  }
  await speaker.setup();

  rq();

  try {
    await fastify.listen({ host: '::', port: 3000 });
  } catch (err) {
    throw err;
  }
};

// oscServer.on('message', (msg) => {
//   const [tag, ja, en] = msg;

//   if (page) {
//     if (tag == '/static') {
//       if (lastMsg != ja) {
//         console.log(`/static -> Message: ${msg[1]}, (Last message: ${lastMsg})`);
//         lastMsg = ja;

//         if (qq.size > 0) qq.clear();

//         if (qq.pending > 0) {
//           (async () => {
//             await page.goto(turl);
//             page.setDefaultTimeout(60 * 1000);
//             await page.setViewport({ width: 1080, height: 1024 });

//             qq.add(async () => readingFunc(ja, en));
//           })();
//         } else {
//           qq.add(async () => readingFunc(ja, en));
//         }
//       }
//     } else {
//       if (lastMsg != ja) {
//         console.log(`/msg -> Message: ${msg[1]}, (Last message: ${lastMsg})`);

//         lastMsg = ja;

//         if (qq.size > 5) { qq.clear(); }

//         qq.add(async () => readingFunc(ja, en));
//       }
//     }
//   }
// });

runApp();
