import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import json2html from 'node-json2html';

import got from 'got';

import 'dotenv/config';

// NOTE: .env
const {
  ANYTHINGLLM_HOST = 'http://0.0.0.0:3001',
  ANYTHINGLLM_APIKEY = '',
  ANYTHINGLLM_TARGET_WORKSPACE = '',
  ANYTHINGLLM_TARGET_THREAD = ''
} = process.env;

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


json2html.component.add(
  "utils/hr", {
    "<>": "hr"
  }
);

json2html.component.add(
  "utils/null", { }
);

json2html.component.add(
  "chat/sources",
  [
    {
      "<>": "h4",
      "text": "Sources"
    },
    {
      "<>": "ul",
      "style": "list-style-type:decimal;",
      "html": [
        {
          "<>": "li",
          "{}": (o) => o.sources,
          "html": [
            {
              "<>": "h5",
              "text": "${title}"
            },
            {
              "<>": "dl",
              "html": [
                { "<>": "dt", "text": "Score" },
                { "<>": "dd", "text": "${score}" }
              ]
            },
            {
              "<>": "dl",
              "html": [
                { "<>": "dt", "text": "Text" },
                {
                  "<>": "dd", "html": (o) => {
                    let ta = o.text.split('\n');
                    let ovf = ta.length >= 25;
                    let ta1 = ta.slice(5, 15);
                    if (ovf) {
                      const ta2 = ta.slice(ta.length - 10, ta.length);
                      ta = [...ta1, '<span class="ovf">(... more than 25 lines ...)</span>', ...ta2];
                    } else {
                      ta = ta.slice(5, 25);
                    }
                    return ta.join('\n');
                  }
                }
              ]
            },
            {
              "<>": "dl",
              "html": [
                { "<>": "dt", "text": "Word Count" },
                { "<>": "dd", "text": "${wordCount}" }
              ]
            }
          ]
        }
      ]
    }
  ]
);

json2html.component.add(
  "chat",
  [
    {
      "<>": "div",
      "class": (o) => o.role == 'user' ? "chat" : "chat response",
      "html": [
        {
          "<>": "header",
          "html": [
            {
              "<>": "h3",
              "text": (o) => `${o.chatId} (${o.role}, ${new Date(o.sentAt * 1000).toString()})`
            }
          ]
        },
        {
          "<>": "div",
          "html": [
            {
              "<>": "p",
              "class": (o) => o.role == 'user' ? "user-content" : "response-content",
              // "text": "${content}"
              "html": (o) => o.content.replace(/\r|\n|( \*\*[.]+\*\*)/g, '<br>')
            },
            {
              "<>": "img",
              "{}": (o) => o.attachments,
              "src": "${contentString}"
            },
          ]
        },
        {
          "<>": "footer",
          "html": [
            {
              "[]": (o) => (o.sources ? "chat/sources" : "utils/null")
            }
          ]
        },
      ]
    },
    {
      "[]": (o) => (o.role == 'user' ? "utils/null" : "utils/hr")
    }
  ]
);

json2html.component.add(
  "config",
  [
    {
      "<>": "div",
      "class": "config",
      "html": [
        {
          "<>": "header",
          "html": [
            {
              "<>": "h2",
              "text": "LLM configs"
            }
          ]
        },
        {
          "<>": "div",
          "html": [
            {
              "<>": "dl",
              "html": [
                { "<>": "dt", "text": "Provider" },
                { "<>": "dd", "text": "${chatProvider}" },
                { "<>": "dt", "text": "Model" },
                { "<>": "dd", "text": "${chatModel}" },
                { "<>": "dt", "text": "System Prompt" },
                { "<>": "dd", "text": "${openAiPrompt}" },
                { "<>": "dt", "text": "Default Temperature" },
                { "<>": "dd", "text": "${openAiTemp}" },
                { "<>": "dt", "text": "Chat History" },
                { "<>": "dd", "text": "${openAiHistory}" },
                { "<>": "dt", "text": "Similarity Threshold" },
                { "<>": "dd", "text": "${similarityThreshold}" },
              ]
            }
          ]
        },
      ]
    }
  ]
);

const tpl = [
  {
    "<>": "html", "html": [
      {
        "<>": "head", "html": [
          { "<>": "title", "text": `${ANYTHINGLLM_TARGET_WORKSPACE}` },
          { "<>": "style", "text": `
:root { font-size: 0.75em; }
img { max-width:80%; object-fit: contain; }
hr { margin: 1.2rem 0; }
h3 { font-weight: normal; }
h5 { margin-block-start: 0.66rem; margin-block-end: 0.66rem; font-size: 1rem; }
dl { display: grid; grid-template-columns: 6rem 1fr; gap: 1rem; font-size: 0.775rem; }
dd { font-style: italic; margin-inline-start: 0.33rem; }

.chat { margin-bottom: 1rem; padding: 0rem 1.2rem; }
.response { margin-left: 1.2rem; padding: 0.6rem 1.2rem; background: #f0f0f0; }
.user-content { font-size: 1.25rem; font-weight: 600; }
.response-content { font-size: 1.25rem; font-style: italic; font-weight: 600; }
.ovf { font-weight: bold; }

.config { margin-bottom: 2rem; padding: 1rem 1.4rem; outline: solid; }
.config dl { font-size: 1.25rem; grid-template-columns: 12rem 1fr; gap: 1.2rem; }

@media print {
img { max-height: 180px; max-width: 80%; object-fit: contain; margin-left: auto; margin-right: auto; }
}
` }
        ]
      },
      {
        "<>": "body", "html": [
          {
            "[]": 'config', "{}": (o) => o.llmConfig
          },
          {
            "[]": 'chat', "{}": (o) => o.chats,
          },
        ]
      }
    ]
  }
];

const main = async () => {
  await mkdir(resolve('./tmp_test')).catch(_ => false);

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

  let targetWS = {};

  if (pInfo.workspaces) {
    const [ ws_first, ...ws_rest ] = pInfo.workspaces.filter((el) => el.slug == ANYTHINGLLM_TARGET_WORKSPACE);

    console.info(ws_first);

    console.log(ws_first.threads);

    targetWS = ws_first;

    if (ANYTHINGLLM_TARGET_THREAD) {
      const ti = ws_first.threads.findIndex((el) => el.name == ANYTHINGLLM_TARGET_THREAD);
      targetThread = ws_first.threads[(ti < 0) ? 0 : ti];
    } else {
      targetThread = ws_first.threads[0];
    }
  }

  // --
  let ret = await got_cl.get(
    `${ANYTHINGLLM_HOST}/api/v1/workspace/${ANYTHINGLLM_TARGET_WORKSPACE}${targetThread ? ('/thread/' + targetThread.slug) : ''}/chats`, {
    responseType: 'json',
  }).json().catch(error => {
    console.error(error);

    return false;
  });

  if (ret && ret['history']) {
    // console.log(ret['history']);

    // ret['history'].forEach((el) => {
    //   console.log(el.chatId, el.sources);
    // });

    const htmlstr = json2html.render({ chats: ret['history'], llmConfig: targetWS }, tpl);
    await writeFile(
      resolve('./tmp_test', `index.${Date.now()}.html`),
      htmlstr
    ).catch(err => console.error(err));
  }
};

main();
