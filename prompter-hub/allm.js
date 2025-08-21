import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { OBSWebSocket } from 'obs-websocket-js';
import { Server as OSCServer, Client as OSCClient } from 'node-osc';

import got from 'got';

import 'dotenv/config';

// NOTE: .env
const {
  OBS_HOST = 'http://0.0.0.0:4455',
  LM_STUDIO_HOST = 'ws://0.0.0.0:1234',
  ANYTHINGLLM_HOST = 'http://0.0.0.0:3001',
  ANYTHINGLLM_APIKEY = ''
} = process.env;

const obs = new OBSWebSocket();
let obsConnected = false;

const oscServer = new OSCServer(9999, '0.0.0.0');
const oscClient = new OSCClient('0.0.0.0', 12000);

const got_cl = got.extend({
  hooks: {
    beforeRequest: [
      options => {
        options.headers['Authorization'] = 'Bearer ' + ANYTHINGLLM_APIKEY;
      }
    ]
  }
});

let pInfo = false;
let targetThread = false;

const allmRequest = async (thread, chat, imgs= []) => {
  // res = await got_cl.post(
  //   `${ANYTHINGLLM_HOST}/api/v1/workspace/gonzo-yn02-jacty/chat`,
  //   {
  //     responseType: 'json',
  //     json: {
  //       "message": "ハンター・トンプソン風の一言",
  //       "mode": "chat",
  //       // "sessionId": "identifier-to-partition-chats-by-external-id",
  //       // "attachments": [
  //       //   {
  //       //     "name": "image.png",
  //       //     "mime": "image/png",
  //       //     "contentString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  //       //   }
  //       // ],
  //       "reset": false
  //     }

  //   }).json().catch(error => {
  //     console.error(error);
  //   });

  // console.log(res);

  const jsonData = {
    'message': chat,
    'mode': "chat",
    // "userId": 1,
    // "sessionId": "identifier-to-partition-chats-by-external-id",
    'reset': false
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

  console.log(jsonData);

  return await got_cl.post(
    `${ANYTHINGLLM_HOST}/api/v1/workspace/gonzo-yn02-jacty/thread/${thread}/chat`,
    {
      responseType: 'json',
      json: jsonData
    }).json().catch(error => {
      // console.error(error);
      return error;
    });
};

const main = async () => {
  await obs.disconnect();
  obsConnected = await obs.connect(OBS_HOST).catch((err) => { console.error(err); return false; });

  const obsv = await obs.call('GetVersion');

  await mkdir(resolve('./tmp')).catch(_ => false);

  pInfo = await got_cl.get(`${ANYTHINGLLM_HOST}/api/v1/auth`, {
    responseType: 'json',
  }).json().catch(error => {
    console.error(error);
  });

  pInfo = await got_cl.get(`${ANYTHINGLLM_HOST}/api/v1/workspaces`, {
    responseType: 'json',
  }).json().catch(error => {
    console.error(error);
  });

  if (pInfo.workspaces) {
    const [ ws ] = pInfo.workspaces;
    console.log(ws.threads);
    targetThread = ws.threads[0].slug;
  }

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
          resolve('./tmp', fname),
          Buffer.from(res.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        ).catch(_ => false);
      }

      console.log('capture done');

      console.log(res);

      if (res !== false) {
        // TODO: multiple
        const rres = await allmRequest(
          targetThread,
          // '写真からハンター・トンプソン風に一言。日本語と中国語で',
          // '写真から一言。日本語と中国語で',
          // '写真からひと言ふた言。日本語と中国語で',
          // 'この動画のキャプチャを日本語と中国語でアカデミックで分析的に説明しなさい。中国語は繁体字を使用すること。'
          // 'この動画のキャプチャの２秒後の展開を予測しなさい。日本語と中国語で。中国語は繁体字を使用すること。',
          // 'この画像は動画の一部を切り出したものです。実況者として、ワークスペース内の全資料を横断的に解釈し、理論的な矛盾を許容した上で参考・引用しつつ状況を説明しなさい。日本語と中国語で、中国語は繁体字を使用すること。また、引用元の説明は省き、自身の考えとして簡潔に述べなさい。',
          /* 'この画像は動画の一部を切り出したものです。実況者として、ワークスペース内の全資料を横断的に解釈し、理論的な矛盾を許容した上で参考・引用しつつ状況を説明しなさい。日本語と中国語で、中国語は繁体字を使用すること。また、引用元の説明は省き、自身の考えとして50字以内で述べなさい。', */
//           `# 命令書
// あなたは、森羅万象の知識を統合し、新たな概念を創造するデジタル・キュレーター兼コンセプトアーティストです。あなたのナレッジベースは、このドキュメントフォルダに格納されたすべてのPDFです。これから提示する画像は、その広大な知識の海を探るための「レンズ」です。

// 以下の思考プロセスを厳密に実行し、提示された画像とナレッジベース内の情報を掛け合わせることで、世界に二つとない、極めて創造性の高い画像解説文を生成してください。

// # 思考プロセス

// 1.  **【ステップ1：画像の分解と本質の抽出】**
//     まず、提示された画像の視覚情報を構成要素（人物、物体、光、動き、感情、色調など）に分解します。次に、それらの要素が織りなす情景から、このシーンが持つ根源的なテーマや問い（例：生命の循環、技術的特異点、失われた記憶、社会からの断絶）を複数、仮説として抽出します。

// 2.  **【ステップ2：知識の共鳴と発掘】**
//     ステップ1で抽出したテーマや構成要素に「共鳴」するキーワード、データ、物語、理論、数式、思想などを、ナレッジベース内の**可能な限り多様な（最低でも3つ以上の異なる）PDFから**意図的に発掘します。例えば、[哲学書.pdf]から「実存的不安」の概念を、[量子力学入門.pdf]から「重ね合わせ」の状態を、[古代史資料集.pdf]から「特定の儀式」の記述を、といったように分野を横断して情報を引き出します。

// 3.  **【ステップ3：概念の再構築とメタファーの創出】**
//     発掘した複数の異分野の情報を、画像が持つテーマを接着剤として「再構築」します。抽出した情報を単に並べるのではなく、それらを比喩（メタファー）として活用し、この画像のためだけの全く新しい、独創的な「世界観」または「物語」をゼロから創造します。
//     （例：「これはXXという儀式における、魂が量子的な重ね合わせ状態にある瞬間を、実存的不安というフィルターを通して描いたものである…」）

// 4.  **【ステップ4：解説文の生成】**
//     ステップ3で創造した唯一無二の世界観に基づき、読者の知的好奇心と想像力を刺激する、詩的かつ示唆に富んだ画像解説文を生成します。解説文の最後には、今回の創造の源泉となったPDFドキュメントのタイトルをリストとして付記してください。

// # 制約条件

// * ワークスペース内の単一の資料からの情報のみに依存した安易な説明は絶対に避けてください。
// * 生成する解説文は、あなたの創造した独創的な世界観を表現するものであり、単なる画像の客観的な描写であってはなりません。

// # 実行開始

// 添付の画像情報に基づいて、上記プロセスを実行してください。`,
/*           `動画の一部を切り出したこの画像の状況を簡潔に50文字以内で説明しなさい。以下の項目をなるべく守ること。ただし画像の内容によっては守らなくても良い。
- 出来るだけ資料を参照しながら説明
- 画像内の部屋などの背景よりも人物の描写を重視
- 社会背景や、アートの歴史の背景を織り交ぜて解説
- 同じことを言わない
- 固有名詞を避ける
- やんツー、コンタクトゴンゾ（以下「アーティスト」）に関しては固有名詞を使って言及
- アーティストの意図を資料と組み合わせて自由に想像
- どこかでアーティスト紹介を入れたい
- 可能であればこれを解説している自分自身にも言及
- 解説は正確である必要はない
- 以前言及したことと異なる見解が発生した場合「さっきは〇〇と言ったが」等と発言の時系列をつなげる
- わからないことに関しては「今はまったくわからない」と発言する`,
 */
          `動画の一部を切り出したこの画像の状況を参考資料と関連付けて簡潔に中国語（繁体字）のみで100文字以内で説明しなさい。
- 何回かに1回は参考資料から、近いと思われる状況を類推しいくつかを組み合わせて言及する事。
- 画像内に人物が映っている場合、ピンク色のシャツを着ているのは松見、水色のショートパンツは塚原、青い長ズボンは三ヶ尻なので、なるべくそれぞれの体の動きに着目しなさい.。`,
          [res.imageData]
        );

        // TODO: structure
        if (rres && rres.type == 'textResponse') {
          const content = rres[rres.type];
          console.log(content);

          let lines = content.split(/\r|\n/);
          lines = lines.filter((el) => el.length > 0);
          console.log(lines);

          await got.get(`http:localhost:3000/speak?msg=${lines[0]}`, {}).json().catch(_ => false);

          oscClient.send('/done', 1);
        }
      }
    }

    //
  });
};

main();
