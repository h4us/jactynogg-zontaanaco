import { setTimeout as sleep } from 'timers/promises';

import Fastify from 'fastify';
import * as FastifyNext from '@fastify/nextjs';
import puppeteer from 'puppeteer';
import PQueue from 'p-queue';
import { Server, Client } from 'node-osc';
import { WebSocketServer } from 'ws';
import got from 'got';
import sample from 'lodash.sample';
import { Configuration, OpenAIApi } from 'openai';

import 'dotenv/config';

// NOTE: .env
const {
  LAVIS_HOST, WS_HOST,  MJPEG_STREAMER_HOST,
  OPENAI_API_KEY, DEEPL_API_KEY,
  OSC_CLIENT_DEST,
} = process.env;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// TODO:
import * as appConfig  from './app.config.js';
const { fetchIntervalSleep } = appConfig;

let page = false;
let lastMsg = '';
const turl = 'https://translate.google.com/?hl=ja&sl=auto&tl=ja';

const oscServer = new Server(9990, '0.0.0.0');
const oscClient = new Client('0.0.0.0', 9991);

const wss = new WebSocketServer({
  port: 3001,
  clientTracking: true
});

const rq = async () => {
  try {
    const t = await got.get(`http://${LAVIS_HOST}:8080`).json();

    let t_j;
    // deepL
    t_j = await got.post('https://api-free.deepl.com/v2/translate', {
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`
      },
      form: {
        text: t[0],
        source_lang: 'EN',
        target_lang: 'JA'
      }
    }).json();

    // chatGPT
    const controller = new AbortController();

    const tc = setTimeout(() => {
      controller.abort();
      console.error('-- timeout gpt');
      // client.send('/msg', [en]);
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
          `次の文章を日本語でもっと具体的にして: "${t}"`,
          // `次の文章を日本語でもっと悲しくして: "${en}"`,
          // `次の文章を日本語でもっと楽しくして: "${en}"`,
          // `次の単語を使った詩を日本語で書いて: "${en}"`,
          // `次の文章の続きを日本語で書いて: "${en}"`
        ])
      }
    ];

    console.log(messages);

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 100,
        messages
      }, {
        signal: controller.signal,
      });
      console.log('gpt: ', completion.data.choices[0].message.content);

      t_j = {
        translations: [
          { text: completion.data.choices[0].message.content }
        ]
      };

      clearTimeout(tc);
    } catch (err) {
      console.error('gpt response err?', err.type);
      clearTimeout(tc);
    }

    const { translations = [] } = t_j;

    if (translations.length > 0) {
      if (wss.clients.size > 0) {
        wss.clients.forEach((el) => el.send(JSON.stringify([translations[0].text])));
      }

      await readingFunc(translations[0].text, '');
    } else {
      if (wss.clients.size > 0) {
        wss.clients.forEach((el) => el.send(JSON.stringify(t)));
      }
    }
  } catch (err) {
    console.error(err.message);
  }

  await sleep(fetchIntervalSleep);

  rq();
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

  rq();

  try {
    await fastify.listen({ host: '::', port: 3000 });
  } catch (err) {
    throw err;
  }
};

const readingFunc = async (msg, msg2) => {
  try {
    console.log('--start', new Date());
    await page.reload({ waitUntil: 'domcontentloaded' });

    await page.waitForSelector('textarea');
    await page.$eval('textarea', element => element.value = '');
    await page.waitForTimeout(500);

    console.log('enter new msg | ', msg);
    await page.type('textarea', msg);

    console.log('read new msg | ', msg);
    await page.waitForSelector('*[data-language-name="日本語"]');
    await page.waitForTimeout(500);
    await page.click('*[data-language-name="日本語"]');

    // --
    await page.waitForTimeout(250);

    // oscClient.send('/msg', [msg, msg2]);

    const bState = await page.evaluateHandle(_ => { return { currentLength: 0, duration: NaN }; });

    const eFunc = async (bs) => {
      return new Promise((resolve, reject) => {
        let wdc = 0;

        const watchDog = setInterval(_ => {
          bs.duration = wdc;
          bs.currentLength = document.querySelectorAll('button[aria-label="翻訳を聞く"]').length;

          if (document.querySelectorAll('button[aria-label="翻訳を聞く"]').length > 0) {
            clearInterval(watchDog);
            resolve();
          }

          if (wdc > 50) {
            clearInterval(watchDog);
            reject();
          }

          wdc++;
        }, 500);
      });
    };

    await page.evaluate(eFunc, bState).catch((e) => false);
    // --
    console.log('--end', new Date(), qq.size);
  } catch (err) {
    console.error('puppeteer error');
  }

  return await page.waitForTimeout(250);
};

oscServer.on('message', (msg) => {
  console.log('Queue size / Running: ', qq.size, qq.pending);

  const [tag, ja, en] = msg;

  if (page) {
    if (tag == '/static') {
      if (lastMsg != ja) {
        console.log(`/static -> Message: ${msg[1]}, (Last message: ${lastMsg})`);
        lastMsg = ja;

        if (qq.size > 0) qq.clear();

        if (qq.pending > 0) {
          (async () => {
            await page.goto(turl);
            page.setDefaultTimeout(60 * 1000);
            await page.setViewport({ width: 1080, height: 1024 });

            qq.add(async () => readingFunc(ja, en));
          })();
        } else {
          qq.add(async () => readingFunc(ja, en));
        }
      }
    } else {
      if (lastMsg != ja) {
        console.log(`/msg -> Message: ${msg[1]}, (Last message: ${lastMsg})`);

        lastMsg = ja;

        if (qq.size > 5) { qq.clear(); }

        qq.add(async () => readingFunc(ja, en));
      }
    }
  }
});

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 60 * 1000
  });
  page = await browser.newPage();

  await page.goto(turl);
  page.setDefaultTimeout(60 * 1000);
  await page.setViewport({ width: 1080, height: 1024 });
})();

runApp();
