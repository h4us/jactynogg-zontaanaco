import puppeteer from 'puppeteer';
import PQueue from 'p-queue';

class PuppeteerSpeaker {
  //
  url = 'https://translate.google.com/?hl=ja&sl=auto&tl=ja';
  client = null;

  // ...?
  qq = new PQueue({ concurrency: 1 });

  constructor() {

  }

  async setup() {
    const browser = await puppeteer.launch({
      headless: false,
      timeout: 60 * 1000
    });

    this.client = await browser.newPage();

    await this.client.goto(this.url);
    this.client.setDefaultTimeout(60 * 1000);
    await this.client.setViewport({ width: 1080, height: 1024 });
  }

  async speak(msg) {
    // NOTE: google translation w/ puppetteer

    if (this.client.isClosed) {
      this.client = await browser.newPage();
      await this.client.goto(this.url);
      this.client.setDefaultTimeout(60 * 1000);
      await this.client.setViewport({ width: 1080, height: 1024 });
    }

    try {
      console.log('--start', new Date());
      await this.client.reload({ waitUntil: 'domcontentloaded' });

      await this.client.waitForSelector('textarea');
      await this.client.$eval('textarea', element => element.value = '');
      await this.client.waitForTimeout(500);

      console.log('enter new msg | ', msg);
      await this.client.type('textarea', msg);

      console.log('read new msg | ', msg);
      await this.client.waitForSelector('*[data-language-name="日本語"]');
      await this.client.waitForTimeout(500);
      await this.client.click('*[data-language-name="日本語"]');

      // --
      await this.client.waitForTimeout(250);

      const bState = await this.client.evaluateHandle(_ => { return { currentLength: 0, duration: NaN }; });

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

      await this.client.evaluate(eFunc, bState).catch((e) => false);
      // --
      console.log('--end', new Date(), qq.size);
    } catch (err) {
      console.error('puppeteer error');
    }

    return await this.client.waitForTimeout(250);
  }

  abort() {
    if (this.client && !this.client.isClosed) {
      console.log('send abort signal');
      this.client.close();
    }
  }
}

export default PuppeteerSpeaker;
