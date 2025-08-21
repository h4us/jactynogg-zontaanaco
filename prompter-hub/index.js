import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { OBSWebSocket } from 'obs-websocket-js';
import { Server as OSCServer, Client as OSCClient } from 'node-osc';

import got from 'got';

import 'dotenv/config';

// NOTE: .env
const {
  OBS_HOST = 'http://0.0.0.0:4455',
  LM_STUDIO_HOST = 'ws://0.0.0.0:1234'
} = process.env;

const obs = new OBSWebSocket();
let obsConnected = false;

const oscServer = new OSCServer(9999, '0.0.0.0');
const oscClient = new OSCClient('0.0.0.0', 12000);

import { LMStudioClient } from "@lmstudio/sdk";
let lmsClient;

const main = async () => {
  await obs.disconnect();
  obsConnected = await obs.connect(OBS_HOST).catch((err) => { console.error(err); return false; });
  // console.info(obsConnected);

  const obsv = await obs.call('GetVersion');
  // console.log(obsv);

  await mkdir(resolve('./tmp')).catch(_ => false);

  lmsClient = new LMStudioClient({ baseUrl: LM_STUDIO_HOST });
  const lmsModel = await lmsClient.llm.model();

  console.log(lmsModel);

  oscServer.on('message', async (e) => {
    const [addr, ...data] = e;
    const fname = `${Date.now()}.jpg`;
    let res = false;

    if (addr == '/capture') {
      res = await obs.call('GetSourceScreenshot', {
        imageFormat: 'jpeg',
        sourceName: data[0],
        // sourceUuid: '',
        // imageWidth: '',
        // imageHeight: '',
      }).catch(_ => false);

      // console.log(res.imageData);

      if (res !== false) {
        res = await writeFile(
          resolve('./tmp', fname),
          Buffer.from(res.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        ).catch(_ => false);
      }

      // res = await obs.call('SaveSourceScreenshot', {
      //   imageFormat: 'jpeg',
      //   imageFilePath: resolve('/workspace', 'tmp', fname),
      //   sourceName: data[0],
      //   // sourceUuid: '',
      //   // imageWidth: '',
      //   // imageHeight: '',
      // }).catch(_ => false);

      // console.log(res);

      if (res !== false) {
        const image = await lmsClient.files.prepareImage(resolve('./tmp', fname));
        const prediction = await lmsModel.respond([
          // { role: "system", content: 'You are a narrator' },
          // { role: "system", content: 'You are a scientist' },
          { role: "system", content: 'Responses must be 1 or 2 sentences' },
          // { role: "user", content: "Describe this image please", images: [image] },
          // { role: 'user', content: 'この動画のキャプチャに映っている事象と逆のことを日本語と中国語で言いなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャはパフォーマンス作品の一場面です。このシーンが何を象徴しているか、日本語と中国語で答えなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語でスポーツ実況風に説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語でアカデミックで分析的に説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語で幼児向けに説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語で俳句を作りなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語でドラマティックに説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          { role: 'user', content: 'この動画のキャプチャを日本語と中国語でハンター・トンプソン風に説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語で赤塚不二夫風に説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語でポール・オースター風に説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語でヘミングウェイ風に説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャに映っているものを日本語と中国語で列挙してください。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語でユーモラスに説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この動画のキャプチャを日本語と中国語で説明しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この画像を日本語と中国語で解説しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この画像パフォーマンス作品の一場面です。このシーンが何を象徴しているかをハンター・トンプソン風のユーモラスな俳句を日本語と中国語で書きなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'この画像はパフォーマンス作品の一場面です。このシーンが何を象徴しているかをコンタクトゴンゾ的に日本語と中国語で解説しなさい。中国語は繁体字を使用すること。', images: [image] },
          // { role: 'user', content: 'このシーンが何を象徴しているかをコンタクトゴンゾ的に日本語と中国語で解説しなさい。中国語は繁体字を使用すること。', images: [image] },
        ]);

        // console.log(prediction);

        const { content = '' } = prediction;
        const lines = content.split(/\r|\n/);

        console.log(lines[0]);
        console.log(lines);

        // await got.get(`http:localhost:3000/speak?msg=${lines[2]}`, {}).json().catch(_ => false);
        // await got.get(`http:localhost:3000/speak?msg=${lines[lines.length - 1]}`, {}).json().catch(_ => false);
        await got.get(`http:localhost:3000/speak?msg=${lines[4]}`, {}).json().catch(_ => false);

        // prediction.result()

        oscClient.send('/done', 1);
      }
    }
  });
};

main();
