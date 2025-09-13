// import { resolve } from 'node:path';
// import { writeFile, mkdir } from 'node:fs/promises';

class CaptionMaker {
  obs = null;
  config = {};
  iSignal1 = null;
  cQueue1 = [];

  iSignal2 = null;
  cQueue2 = [];

  iSignal3 = null;
  cQueue3 = [];

  chunkTexts(text, options = {}) {
    const {
      maxLength = 180,
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

  async setup(obsRef, _config = {}) {
    this.obs = obsRef;

    const {
      captionName1 = 'caption-1',
      captionName2 = 'caption-1-alt',
      captionName3 = 'caption-1-opt',
      refreshRate = 4000
    } = _config;

    this.config = { captionName1, captionName2, captionName3, refreshRate };

    // - TODO: validation
    // let { inputs: captionInputs } = await this.obs.call('GetInputList').catch(_ => false);
    // captionInputs = captionInputs.filter((el) => /^text_gdiplus.*/.test(el.inputKind));

    // const [f_caption = false, ...rest_caption] = captionInputs;

    // if (f_caption) {
    //   const settings = await this.obs.call('GetInputSettings', { inputUuid: f_caption.inputUuid }).catch(_ => false);
    //   console.log(settings);
    // }
  }

  async post(inputName, text) {
    // TODO: validation
    await this.obs.call('SetInputSettings', {
      inputName,
      inputSettings: {
        text
      }
    });
  }

  flush() {
    this.post(this.config.captionName1, '');
    this.post(this.config.captionName2, '');
    this.post(this.config.captionName3, '');
  }

  make(caption1, caption2, caption3, options = {}) {
    // console.log(caption1, caption2, caption3);

    const [c1, ...rest_c1] = this.chunkTexts(caption1);
    const [c2, ...rest_c2] = this.chunkTexts(caption2);
    const [c3, ...rest_c3] = this.chunkTexts(caption3);

    this.post(this.config.captionName1, c1);
    this.post(this.config.captionName2, c2);
    this.post(this.config.captionName3, c3);

    // TODO:
    if (rest_c1.length > 0) {
      this.cQueue1 = [...rest_c1];
      setTimeout(() => {
        this.iSignal1 = setInterval(() => {
          // console.log('internal update', this.config, this.cQueue1);
          const c = this.cQueue1.shift();
          if (c) {
            this.post(this.config.captionName1, c);
          } else {
            clearInterval(this.iSignal1);
          }
        }, this.config.refreshRate);
      }, this.config.refreshRate);
    } else {
      this.cQueue1 = [];
    }

    if (rest_c2.length > 0) {
      this.cQueue2 = [...rest_c2];
      setTimeout(() => {
        this.iSignal2 = setInterval(() => {
          // console.log('internal update', this.config, this.cQueue2);
          const c = this.cQueue2.shift();
          if (c) {
            this.post(this.config.captionName2, c);
          } else {
            clearInterval(this.iSignal2);
          }
        }, this.config.refreshRate);
      }, this.config.refreshRate);
    } else {
      this.cQueue2 = [];
    }

    if (rest_c3.length > 0) {
      this.cQueue3 = [...rest_c3];
      setTimeout(() => {
        this.iSignal3 = setInterval(() => {
          // console.log('internal update', this.config, this.cQueue3);
          const c = this.cQueue3.shift();
          if (c) {
            this.post(this.config.captionName3, c);
          } else {
            clearInterval(this.iSignal3);
          }
        }, this.config.refreshRate);
      }, this.config.refreshRate);
    } else {
      this.cQueue3 = [];
    }
  }
};

export default CaptionMaker;
