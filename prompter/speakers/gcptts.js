import TextToSpeech from '@google-cloud/text-to-speech';
import { writeFile } from 'fs/promises';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';
const exec = promisify(_exec);

class GCPTTSSpeaker {
  client = new TextToSpeech.TextToSpeechClient();

  async setup() {}

  async speak(msg) {
    const request_ja = {
      input: { text: msg },
      voice: {
        languageCode: 'ja-JP', ssmlGender: 'MALE',
        name: 'ja-JP-Neural2-D'
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await this.client.synthesizeSpeech(request_ja);

    const ja_audio = `./audio/ja_${Date.now()}.mp3`;

    await writeFile(`${ja_audio}`, response.audioContent, 'binary');

    await exec(`ffplay -v 0 -nodisp -autoexit ${ja_audio}`);
  }
}

export default GCPTTSSpeaker;
