import got from 'got';
import OpenAI from 'openai';

import 'dotenv/config';

// NOTE: .env
const {
  OPENAI_API_KEY = 'lemonade',
  OPENAI_API_BASE_URL = 'http://192.168.1.7:8080/api/v1',
  ANYTHINGLLM_HOST = 'http://0.0.0.0:3001',
  ANYTHINGLLM_APIKEY = '',
  ANYTHINGLLM_TARGET_WORKSPACE = ''
} = process.env;

// const client = new OpenAI({
//   baseURL: OPENAI_API_BASE_URL,
//   apiKey: OPENAI_API_KEY
// });

const got_cl = got.extend({
  hooks: {
    beforeRequest: [
      options => {
        options.headers['Authorization'] = 'Bearer ' + ANYTHINGLLM_APIKEY;
      }
    ]
  }
});

const main = async () => {
  const models = await got_cl.get(`${ANYTHINGLLM_HOST}/api/v1/openai/models`, {
    responseType: 'json',
  }).json().catch(error => {
    console.error(error);
  });

  const { data: rd = [] } = models;
  const [targetModel, ...rest] = rd.filter((el) => el.model == 'jacty-tpac');

  console.log(targetModel);

  if (targetModel) {
    const chats = await got_cl.post(
      `${ANYTHINGLLM_HOST}/api/v1/openai/chat/completions`,
      {
        responseType: 'json',
        json: {
          "messages": [
            {
              "role": "system",
              "content": "You are a narrator"
            },
            {
              "role": "user",
              "content": "ハンター・トンプソン風の一言。日本語と中国語（繁体字）のみで回答"
            }
          ],
          "model": targetModel.model,
          // "stream": true
        }
      }
    ).json().catch(error => {
      console.error(error);
      return {};
    });

    console.log(chats);

    const { choices = [] } = chats;

    console.log(choices);
  }
  // const completion = await client.chat.completions.create({
  //   model: 'Qwen-2.5-7B-Instruct-Hybrid',
  //   messages: [
  //     // { role: 'developer', content: 'Talk like a pirate.' },
  //     // { role: 'user', content: 'Are semicolons optional in JavaScript?' },
  //     { 'role': 'user', 'content': '日本で一番人気のある食べ物は何ですか？' }
  //   ],
  // });

  // console.log(completion.choices[0].message.content);
};

main();
