// import { resolve } from 'node:path';
// import { writeFile, mkdir } from 'node:fs/promises';

class CaptureMaker {
  obs = null;
  config = null;

  async setup(obsRef, _config = {}) {
    this.obs = obsRef;

    const {
      captureName = 'capture-1',
      sceneName = 's1'
    } = _config;

    this.config = { captureName, sceneName };

    const { sceneItems = [] } = await this.obs.call('GetSceneItemList', { sceneName: this.config.sceneName }).catch(_ => false);
    const [ capture_f, ...capture_rest ] = sceneItems.filter((el) => el.sourceName == this.config.captureName );

    if (capture_f) {
      this.config.captureId = capture_f.sceneItemId;
    }

    console.log(this.config);

    // - TODO: validation

    // let { inputs: captureInputs } = await this.obs.call('GetInputList').catch(_ => false);
    // captureInputs = captureInputs.filter((el) => /^image_source$/.test(el.inputKind));
    // console.log(captureInputs);

    // const [f_capture = false, ...rest_capture] = captureInputs;

    // if (f_capture) {
    //   const settings = await this.obs.call('GetInputSettings', { inputUuid: f_capture.inputUuid }).catch(_ => false);
    //   console.log(settings);
    // }
  }

  async show(inputName, file) {
    // TODO: validation
    await this.obs.call('SetInputSettings', {
      inputName,
      inputSettings: {
        file
      }
    });

    await this.obs.call('SetSceneItemEnabled', {
      sceneName: this.config.sceneName,
      sceneItemId: this.config.captureId,
      sceneItemEnabled: true
    });
  }

  capture(file, options = {}) {
    this.show(this.config.captureName, file);
  }

  uncapture() {
    this.obs.call('SetSceneItemEnabled', {
      sceneName: this.config.sceneName,
      sceneItemId: this.config.captureId,
      sceneItemEnabled: false
    });
  }
};

export default CaptureMaker;
