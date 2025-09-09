import OpenAI from 'openai';

import 'dotenv/config';

// NOTE: .env
const {
  OPENAI_API_KEY = 'lemonade',
  OPENAI_API_BASE_URL = 'http://192.168.1.7:8080/api/v1'
} = process.env;

const client = new OpenAI({
  baseURL: OPENAI_API_BASE_URL,
  apiKey: OPENAI_API_KEY
});

const completion = await client.chat.completions.create({
  // model: 'Llama-3.2-1B-Instruct-Hybrid',
  model: 'Qwen-2.5-7B-Instruct-Hybrid',
  messages: [
    // { role: 'developer', content: 'Talk like a pirate.' },
    // { role: 'user', content: 'Are semicolons optional in JavaScript?' },
    { 'role': 'user', 'content': '日本で一番人気のある食べ物は何ですか？' }
  ],
});

console.log(completion.choices[0].message.content);
