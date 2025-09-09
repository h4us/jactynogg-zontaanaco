import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { exec as _exec } from 'node:child_process';
import { promisify } from 'util';
const exec = promisify(_exec);

import TextToSpeech from '@google-cloud/text-to-speech';

class GCPTTSSpeaker {
  client = new TextToSpeech.TextToSpeechClient();
  processed = null;
  abortController = null
  oscClientRef = null

  async setup(replyOSCClient = null, speakerConfig = {}) {
    this.speakerConfig = {
      languageCode: 'ja-JP',
      ssmlGender: 'MALE',
      name: 'ja-JP-Neural2-D',
      ...speakerConfig
    };

    console.info(this.speakerConfig);

    this.oscClientRef = replyOSCClient;
  }

  async speak(msg) {
    const { languageCode, ssmlGender, name } = this.speakerConfig;
    const request = {
      input: { text: msg },
      voice: {
        languageCode, ssmlGender, name
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0, // (0.25-4.0)
        pitch: 0.0, // (-20.0 - 20.0)
        volumeGainDb: 0.0, // ?(-96.0 - 16.0)
      },
    };

    const [response] = await this.client.synthesizeSpeech(request);

    const audio_filename = `${Date.now()}.mp3`;
    const audio_path = resolve('./tmp_audio', audio_filename);

    await writeFile(`${audio_path}`, response.audioContent, 'binary');

    if (this.oscClientRef) {
      console.log('/speak_ready');
      this.oscClientRef.send('/speak_ready', audio_filename);
    } else {
      // ...
      // this.abortController = new AbortController();
      // const { signal } = this.abortController;

      // this.processed = await exec(`ffplay -v 0 -nodisp -autoexit ${ja_audio}`, { signal });
    }
  }

  abort() {
    if (this.processed && this.abortController) {
      console.log('send abort signal');
      this.abortController.abort();
    }
  }
}

export default GCPTTSSpeaker;
