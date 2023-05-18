const net = require('net');
const { EventEmitter } = require('events');
const { writeFile, readFile } = require('fs').promises;
const { resolve } = require('path');
const _ = {
  template: require('lodash.template')
};

const {
  parseAGVStatus,
  getAGVTaskInstructions, decodeAGVTasks, encodeAGVTasks
} = require('./data');

const { StorageService } = require('./states');

class AGVBridge extends EventEmitter {
  constructor(stores = null, queueManager = null, appConfig = null) {
    super();

    const { presetsStore } = stores;
    this.presetsStore = presetsStore;

    this.qm = queueManager;
    this.sock = null;
    this.service = null;
    this.connected = false;
    this.host = '';
    this.port = 0;
    this.timerId = false;
    this.watcherId = false;
    this.cmdPrefix = Buffer.from([0xaa, 0x55]);
    this.cmdCounter = 0;

    this._listeners = new Map();

    this._lastTaskConfig = null;
    this._lastConfigIndex = 0;

    // TODO: debug only
    this.observableCount = new Proxy({
      queueCount: 0,
      listenrCount: 0
    }, {
      set: (obj, prop, val) => {
        let isChanged = false;
        if (obj[prop] !== val) isChanged = true;
        obj[prop] = val;
        if (isChanged) console.log('current qeue size -> ', obj.queueCount, 'listener count -> ', obj.listenrCount);

        return true;
      }
    });
    // --

    this.observableState = new Proxy({
      basicState: [],
      digitalState: [],
      naviState: [],
      landmarkHistoryRecord: [],
      taskMonitor: []
    }, {
      set: (obj, prop, val) => {
        obj[prop] = val;

        return true;
      }
    });

    this.setMaxListeners(30);

    // NOTE: for async
    this.setup(stores, appConfig);
  }

  async setup(stores, appConfig) {
    const {
      State = false,
      TaskConfigPatterns,
      DelayConfigPatterns,
      CornersConfig,
      initialDest, forceInitWithAppConfig, edgeLandmarks, blankEdgeLandmarks,
      invalidLandmarks,
      invalidTransitions,
    } = appConfig;

    const { statesStore } = stores;

    console.info(appConfig);
    console.info(`>> Entered lazy setup for AGVBridge.. @${new Date()}\r\n`);

    try {
      await this.connect();
    } catch (err) {
      console.error(err, new Date());
    }

    if (this.connected) {
      const init = Buffer.from([0xaa, 0x55, 0x03, 0x00, 0x3c, 0x12, 0x2d]);
      await this.commit(init, { timeout: 3000 });
    }

    console.info(`<< Done.. @${new Date()}\r\n`);

    this.taskConfig = TaskConfigPatterns;
    this.delayConfig = DelayConfigPatterns;
    this.cornersConfig = CornersConfig;

    this.service = new StorageService(statesStore);
    this.service
      .on('states', (current, history) => this.emit('status', {
        path: `/state/xstate`,
        data: [current, history]
      }));

    await this.service.setup({
      initialDest, forceInitWithAppConfig, edgeLandmarks, blankEdgeLandmarks, invalidLandmarks,
      cornersLandmarks: Object.values(CornersConfig)
    });

    if (State) {
      console.info('watcher config found in package.json', State);
      this.watchStatus(State);
    }

    console.info(`AGVBridge is online @${new Date()}\r\n`);
  }

  cct() {
    this.cmdCounter = (this.cmdCounter + 1) % 256;
    return this.cmdCounter;
  }

  async connect(host = '10.10.100.254', port = 8899) {
    this.host = host;
    this.port = port;

    if (this.sock !== null) {
      if (!this.sock.destroyed) this.sock.destroy();
      this.sock = null;
    }

    return new Promise((resolve, reject) => {
      this.sock = net.connect({
        host, port
      });

      this.sock.on('error', (err) => {
        console.error('TCP connection failed: ', err, new Date());
        this.connected = false;
        reject(false);
      });

      this.sock.on('connect', () => {
        console.info(`Connected to ${this.host}:${this.port}`);
        this.connected = true;
        resolve(true);
      });

      this.sock.on('close', (err) => {
        console.info(`Connection closed. ${this.host}:${this.port}`);
        this.connected = false;
      });
    });
  }

  async commit(cmd, options = {}) {
    const { timeout = 1000, autoConnect = true, priority = 0 } = options;
    if (!this.connected && autoConnect) {
      console.info('connection is lost, try reconnection..');
      await this.connect(this.host, this.port).catch((err) => {
        console.error(err, new Date());
      });
    }

    this.observableCount.listenrCount = this.sock.listenerCount('data');
    this.observableCount.queueCount = this.qm.size;

    const marker = Symbol();

    if (this.qm.size > 80) { this.qm.clear(); console.info('flush queue'); }

    const ret = this.qm.add(async () => new Promise((resolve) => {
      const tout = setTimeout(() => {
        console.error('timeout!', cmd, marker.toString(), new Date());
        done({ query: cmd, reason: 'timeout' });
      }, timeout);

      const done = (rObj) => {
        if (this._listeners.has(marker)) {
          this.sock.off('data', this._listeners.get(marker));
          this._listeners.delete(marker);
        }

        if (tout) clearTimeout(tout);

        resolve(rObj);
      };

      this._listeners.set(marker, (res) => {
        done({ query: cmd, response: res });
      });
      this.sock.on('data', this._listeners.get(marker));

      this.sock.write(cmd);
    }));

    return ret;
  }

  watchStatus(t = 0, interval = 500) {
    const paths = [
      false, // 0
      { val: [0x01, 0x02], label: 'basicState' }, // 1
      { val: [0x07], label: 'digitalState' }, // 2
      { val: [0x08, 0x0d], label: 'naviState' }, // 3
      { val: [0x35], label: 'landmarkHistoryRecord' }, //4
      { val: [0x20], label: 'taskMonitor' }, //5
      // custom, combined
      {
        val: [0x07, 0x35, 0x20], label: 'customStates',
        replyLabels: {
          [0x07.toString()]: 'digitalState',
          [0x35.toString()]: 'landmarkHistoryRecord',
          [0x20.toString()]: 'taskMonitor'
        }
      } // 6
    ];

    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = false;
    }

    if (this.connected && t > 0) {
      this.watcherId = t;
      this.timerId = setInterval(async () => {
        const res = [];

        const prepareStatusCmd = (page) => {
          const rnd = this.cct();
          const buf = Buffer.alloc(5);
          buf[0] = 0x03;
          buf[2] = rnd;
          buf[3] = page;
          let cksum = 0x00;
          for (let el of buf) { cksum ^= el; }
          buf[buf.length - 1] = cksum;
          return Buffer.concat([this.cmdPrefix, buf]);
        };

        for (let v of paths[t].val) {
          const ds = prepareStatusCmd(v);
          // const _res = await this.commit(ds, { timeout: interval - 1 });
          const _res = await this.commit(ds, { timeout: interval * 2 });
          if (paths[t].replyLabels) {
            // for combined
            res.push({ [paths[t].replyLabels[v]]: parseAGVStatus(_res) });
          } else {
            res.push(...parseAGVStatus(_res));
          }
        }

        if (paths[t].replyLabels) {
          // for combined
          Object.values(paths[t].replyLabels).forEach((el) => {
            const cres = res.filter((iel) => typeof iel[el] !== 'undefined').pop();
            if (cres && cres[el].length > 0) {
              this.observableState[el] = cres[el];
              this.emit('status', {
                path: `/state/${el}`, data: cres[el]
              });
            }
          });
        } else {
          if (res.length > 0) {
            this.observableState[paths[t].label] = res;
            this.emit('status', {
              path: `/state/${paths[t].label}`, data: res
            });
          }
        }
      }, interval);
    }
  }

  /*
   * Script APIs
   */
  async uploadScript() {
    // TODO: improve
    let ret = { data: false };

    if (this.connected) {
      const prepareUploadCmdWithAddr = (addr = 0) => {
        const rnd = this.cct();
        const buf = Buffer.alloc(11);
        buf[0] = 0x09;
        buf[2] = rnd;
        buf[3] = 0x11;
        buf[4] = 0x03;
        buf[5] = addr == 0 ? 0x00 : 0x01;
        buf.writeInt16LE(addr, 6);
        let cksum = 0x00;
        for (let el of buf) { cksum ^= el; }
        buf[buf.length - 1] = cksum;
        return Buffer.concat([this.cmdPrefix, buf]);
      };

      let script = [];
      let addr = 0;
      let isLastData = false;

      while (!isLastData) {
        const ds = prepareUploadCmdWithAddr(addr);
        const res = await this.commit(ds, { timeout: 5000, priority: 2 });
        const { response = false } = res;
        if (response) {
          let s = '';
          // response.forEach((el, i) => s += `${i != 0 ? ' ' : ''}${el.toString(16).padStart(2, '0')}` );
          // console.log(s);
          const toReadBytes = response[18];
          const str = response.toString('utf8', 20, 20 + toReadBytes);
          script.push(str);
          addr += 64;
          isLastData = response[6] > 1;
        } else {
          isLastData = true;
        }
      }

      script = script.map(el => el.replace(/\r/gm, '\r\n'));
      script = script.join('');

      ret = { data: script };
    }

    return ret;
  }

  loadScriptFromFile(sbuf) {
    // TODO: improve
    return { data: sbuf.toString() };
  }

  async loadScriptFromPreset(name) {
    if (this.presetsStore) {
      await this.presetsStore.read();
      // TODO: validation
      return {
        data: this.presetsStore.data[name]['script']
      };
    } else {
      return { data: false };
    }
  }

  async downloadScript(data, template = false) {
    // TODO: improve
    let ret = { data: false };
    let srcData = data;

    if (template) {
      // NOTE:  test
      const tplstr = await readFile(resolve(__dirname, '../templates', 'main.script.tpl'));
      const tpl = _.template(tplstr);
      const args = (!data) ? { ...this.delayConfig[0], ...this.cornersConfig } : data;

      srcData = tpl(args);

      console.log(args);
    }

    if (this.connected) {
      const scriptAll = Buffer.from(srcData.replace(/\r\n/gm, '\r')); // TODO: it's not a strict way

      const prepareDownloadCmdWithAddr = (chunk = '', addr, contentLength, total) => {
        const rnd = this.cct();
        const opbuf = Buffer.alloc(15);
        const txbuf = Buffer.alloc(64 + 1);
        txbuf.write(chunk);
        opbuf[0] = 0x4e;
        opbuf[2] = rnd;
        opbuf[3] = 0x10;
        opbuf.writeInt16LE(addr, 4);
        opbuf[8] = 0x03;
        opbuf[9] = addr == 0 ? 0x00 : (contentLength < 64 ? 0x02 : 0x01);
        opbuf.writeInt16LE(total, 10);
        opbuf[14] = contentLength;
        const buf = Buffer.concat([opbuf, txbuf]);
        let cksum = 0x00;
        for (let el of buf) { cksum ^= el; }
        buf[buf.length - 1] = cksum;
        return Buffer.concat([this.cmdPrefix, buf]);
      };

      let addr = 0;
      let isLastData = false;
      const commands = [];

      while (!isLastData) {
        const chunk = scriptAll.toString('utf8', addr, addr + (addr == 0 ? 1 : 64));
        // console.log(`\r\n${chunk}\r\n${chunk.length}`);
        if (chunk.length < 64 && addr > 0) isLastData = true;
        commands.push(prepareDownloadCmdWithAddr(chunk, addr, chunk.length, scriptAll.length));
        addr += (addr == 0 ? 1 : 64);
      }

      for (let cmd of commands) {
        let s = '';
        cmd.forEach((el, i) => s += `${i != 0 ? ' ' : ''}${el.toString(16).padStart(2, '0')}`);
        // console.log(s, cmd.length);

        const res = await this.commit(cmd, { timeout: 5000, priority: 2 });
        const { response = false } = res;
        if (response) {
          let rs = '';
          response.forEach((el, i) => rs += `${i != 0 ? ' ' : ''}${el.toString(16).padStart(2, '0')}`);
          // console.log(rs, response.length);
          ret = response;
        }
      }
    }

    return ret;
  }

  /*
   * Tasklink APIs
   */
  loadTasksFromFile(tbuf) {
    // TODO: improve
    return { data: decodeAGVTasks(tbuf) };
  }

  async loadTasksFromPreset(name) {
    if (this.presetsStore) {
      await this.presetsStore.read();
      // TODO: validation
      return {
        data: decodeAGVTasks(Buffer.from(this.presetsStore.data[name]['tasks']))
      };
    } else {
      return { data: [] };
    }
  }

  async uploadTasks(autoDecode = true) {
    // TODO: improve
    let ret = { data: false };

    if (this.connected) {
      const prepareUploadCmdWithAddr = (addr = 0) => {
        const rnd = this.cct();
        const buf = Buffer.alloc(11);
        buf[0] = 0x09;
        buf[2] = rnd;
        buf[3] = 0x11;
        buf[4] = 0x01;
        buf[5] = addr == 0 ? 0x00 : 0x01;
        buf.writeInt16LE(addr, 6);
        let cksum = 0x00;
        for (let el of buf) { cksum ^= el; }
        buf[buf.length - 1] = cksum;
        return Buffer.concat([this.cmdPrefix, buf]);
      };

      let tasks = [];
      let addr = 0;
      let isLastData = false;

      while (!isLastData) {
        const ds = prepareUploadCmdWithAddr(addr);
        const res = await this.commit(ds, { timeout: 5000, priority: 2 });
        const { response = false } = res;
        if (response) {
          let s = '';
          // response.forEach((el, i) => s += `${i != 0 ? ' ' : ''}${el.toString(16).padStart(2, '0')}` );
          // console.log(s);
          const toReadBytes = response[18];
          const chunk = response.subarray(20, 20 + toReadBytes);
          tasks.push(chunk);
          addr += 64;
          isLastData = response[6] > 1;
        } else {
          isLastData = true;
        }
      }

      const tbuf = Buffer.concat(tasks);

      ret = {
        data: (autoDecode ? decodeAGVTasks(tbuf) : tbuf)
      };
    }

    return ret;
  }

  async downloadTasks(data, autoEncode = true, template = false) {
    let ret = { data: false };
    let srcData = data;

    if (template) {
      const tplstr = await readFile(resolve(__dirname, '../templates', 'main.json.tpl'));
      const tpl = _.template(tplstr);
      const args = (!data) ? { ...this.delayConfig[0], ...this.taskConfig[0] } : data;

      const structed = JSON.parse(tpl(args));
      srcData = Object.keys(structed).map((el) => { return { label: el, data: structed[el] }; });

      console.log(args);
    }

    if (this.connected) {
      const prepareDownloadCmdWithAddr = (chunk, addr, contentLength, total) => {
        const rnd = this.cct();
        const opbuf = Buffer.alloc(15);
        const txbuf = Buffer.concat([chunk], 64 + 1);
        opbuf[0] = 0x4e;
        opbuf[2] = rnd;
        opbuf[3] = 0x10;
        opbuf.writeInt16LE(addr, 4);
        opbuf[8] = 0x01;
        opbuf[9] = addr == 0 ? 0x00 : (contentLength < 64 ? 0x02 : 0x01);
        opbuf.writeInt16LE(total, 10);
        opbuf[14] = contentLength;
        const buf = Buffer.concat([opbuf, txbuf]);
        let cksum = 0x00;
        for (let el of buf) { cksum ^= el; }
        buf[buf.length - 1] = cksum;
        return Buffer.concat([this.cmdPrefix, buf]);
      };

      let taskAll;
      let addr = 0;
      let isLastData = false;
      const commands = [];

      if (autoEncode) {
        const tasks = encodeAGVTasks(srcData);
        taskAll = Buffer.concat([Buffer.from([0xaa, 0xbb, 0x00, 0x0a, 0x00, 0x00]), ...tasks]);
      } else {
        taskAll = srcData;
      }

      while (!isLastData) {
        const chunk = taskAll.subarray(addr, addr + (addr == 0 ? 1 : 64));
        if (chunk.length < 64 && addr > 0) isLastData = true;
        commands.push(prepareDownloadCmdWithAddr(chunk, addr, chunk.length, taskAll.length));
        addr += (addr == 0 ? 1 : 64);
      }

      for (let cmd of commands) {
        let s = '';
        cmd.forEach((el, i) => s += `${i != 0 ? ' ' : ''}${el.toString(16).padStart(2, '0')}`);
        // console.log(s, cmd.length);
        const res = await this.commit(cmd, { timeout: 5000, priority: 2 });
        const { response = false } = res;
        if (response) {
          let rs = '';
          response.forEach((el, i) => rs += `${i != 0 ? ' ' : ''}${el.toString(16).padStart(2, '0')}`);
          // console.log(rs, response.length);
          ret = response;
        }
      }
    }

    return ret;
  }

  async writeTasksAsTemplate(data) {
    let ret = { data: false };

    const tasks = encodeAGVTasks(data, 'json');

    try {
      ret.data = await writeFile(
        resolve(__dirname, '../templates', `${new Date().toISOString()}.json.tpl`),
        JSON.stringify(tasks, null, 2)
      );
    } catch (err) {
      console.error(err, new Date());
      ret = { error: err };
    }

    return ret;
  }

  getTaskInstructions() {
    return getAGVTaskInstructions();
  }

  /*
   * Commands, operations
   */
  async remoteCall(type = 0, target = 0) {
    // type: 0 = Task, 1 = Script
    let ret = { status: -1 };

    if (this.connected) {
      const rnd = this.cct();
      const buf = Buffer.alloc(7);
      buf[0] = 0x05;
      buf[2] = rnd;
      buf[3] = 0x31;
      buf[4] = type;
      buf[5] = target;
      let cksum = 0x00;
      for (let el of buf) { cksum ^= el; }
      buf[buf.length - 1] = cksum;
      const ds = Buffer.concat([this.cmdPrefix, buf]);
      ret = await this.commit(ds);
    }

    return ret;
  }

  async setMode(m = 0) {
    let ret = { status: -1 };

    if (this.connected) {
      const rnd = this.cct();
      const cksum = 0x04 ^ 0x00 ^ rnd ^ 0x04 ^ m;
      const ds = Buffer.from([0xaa, 0x55, 0x04, 0x00, rnd, 0x04, m, cksum]);
      ret = await this.commit(ds);
    }

    return ret;
  }

  async start() {
    let ret = { status: -1 };

    if (this.connected) {
      const rnd = this.cct();
      const cksum = 0x04 ^ 0x00 ^ rnd ^ 0x03 ^ 0x00;
      const ds = Buffer.from([0xaa, 0x55, 0x04, 0x00, rnd, 0x03, 0x00, cksum]);
      console.log('start', ds);
      ret = this.commit(ds);
    }

    return ret;
  }

  async stop() {
    let ret = { status: -1 };

    if (this.connected) {
      const rnd = this.cct();
      const cksum = 0x04 ^ 0x00 ^ rnd ^ 0x03 ^ 0x01;
      const ds = Buffer.from([0xaa, 0x55, 0x04, 0x00, rnd, 0x03, 0x01, cksum]);
      console.log('stop', ds);
      ret = await this.commit(ds);
    }

    return ret;
  }

  async reset() {
    let ret = { status: -1 };

    if (this.connected) {
      const rnd = this.cct();
      const cksum = 0x04 ^ 0x00 ^ rnd ^ 0x03 ^ 0x03;
      const ds = Buffer.from([0xaa, 0x55, 0x04, 0x00, rnd, 0x03, 0x03, cksum]);
      console.log('reset', ds);
      ret = this.commit(ds);
    }

    return ret;
  }
}

module.exports = {
  AGVBridge,
  createBridge: (store = null, queueManager = null, appConfig = null) => {
    const bridge = new AGVBridge(store, queueManager, appConfig);
    return bridge;
  }
};
