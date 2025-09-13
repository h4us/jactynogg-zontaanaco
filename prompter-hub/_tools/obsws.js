import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { setTimeout as sleep } from 'node:timers/promises';

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

function chunkTexts(text, options = {}) {
  const {
    maxLength = 100,
    preferSentenceEnd = true,
    customSeparators = []
  } = options;

  const chunks = [];
  let currentChunk = '';

  const defaultSeparators = /(\s+|[.,;:!?。、！？\n\r])/;
  const allSeparators = customSeparators.length > 0
    ? new RegExp(`(${customSeparators.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}|\\s+|[.,;:!?。、！？\\n\\r])`)
    : defaultSeparators;

  const parts = text.split(allSeparators);

  for (const part of parts) {
    if (!part) continue;

    const testChunk = currentChunk + part;

    if (testChunk.length <= maxLength) {
      currentChunk = testChunk;
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = part;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const main = async () => {
  await obs.disconnect();

  obsConnected = await obs.connect(OBS_HOST).catch((err) => { console.error(err); return false; });

  const obsv = await obs.call('GetVersion');

  await mkdir(resolve('./tmp_test')).catch(_ => false);

  // res = await obs.call('GetInputList', {
  //   inputKind: //
  // }).catch(_ => false);

  let { inputs: captionInputs } = await obs.call('GetInputList').catch(_ => false);
  captionInputs = captionInputs.filter((el) => /^text_gdiplus.*/.test(el.inputKind));

  const [f_caption = false, ...rest_caption] = captionInputs;

  if (f_caption) {
    const settings = await obs.call('GetInputSettings', { inputUuid: f_caption.inputUuid }).catch(_ => false);
    console.log(settings);

    if (settings.inputSettings && settings.inputSettings.text) {
      await sleep(1000);
      await obs.call('SetInputSettings', {
        inputUuid: f_caption.inputUuid,
        inputSettings: {
          text: new Date().toString()
        }
      }).catch(_ => false);
    }
  }


  const caption_en = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`;

  const lcaption_en = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  const caption_ch = `路友士松什英員但澡幸午胡，喜封歌它乞放八豆植乾哪根就從申，她犬彩帶示布科發幾尼怪士童過巾邊！明想寺明步開金或旁結。交共羊寫很申寫忍訴主冬。錯尼反犬固。`;

  const lcaption_ch = `路友士松什英員但澡幸午胡，喜封歌它乞放八豆植乾哪根就從申，她犬彩帶示布科發幾尼怪士童過巾邊！明想寺明步開金或旁結。交共羊寫很申寫忍訴主冬。錯尼反犬固。毛高澡着節浪青娘次！兒片五左民休浪丁勿太杯明！交共乾申香節跟躲里能隻能那氣姐且休，不給肉英好直筆壯苦用木這民草帶害進兆這。請忍發燈壯五蝶。米牛父晚掃棵能到世。千干十後子耍福玩歡就；們活歌！收細抄波。穿者第奶象雪戶游七羊但魚。課外蝴工常斗奶室氣一兒，發葉忍百干申他喜花春至手穿高間；拉請固斥科哥少毛少奶洋車，怪收讀朱間彩呢因頭筆。麼金香北士到尼聽兌己拉功園色六耳服中。二英澡找植幾而內尼動耳成，到時手好停道中喜月把游七說正裝身壯免長。高拍彩前只教位息助百貫肉去正：東朵來因抱吉又？坡告共過時路走人。別多鳥，里它牙棵呀鳥雄室誰空比事入，朵即京牛常物找給下！肉動南具福帽己世細出冒？活固耳陽；荷采記不，直五馬帶方，土小九這明掃發定記由服士勿草寺止成次童抄！麻高玉她笑訴力穿快；休登跑黃。寸想定消。忍意生午、信雲只邊得校丁浪買假春英，尼尺丟里時羽早裏具夏耳八金奶前助羽習門帶，只貝甲占植急象寺助自斗貝，步牙自幸根。玉告流足婆且喜苗，良手氣語造紅幾。天跳法字。`;

  console.log(chunkTexts(lcaption_en, { maxLength: 160 }));
  console.log(chunkTexts(lcaption_ch, { maxLength: 160 }));

  oscServer.on('error', async (e) => {
    console.error('err!', e);
    return -1;
  });

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
