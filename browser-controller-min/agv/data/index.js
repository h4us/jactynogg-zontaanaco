const ScriptInstructionsMap = require('./script-instructions');
const TaskInstructionsMap = require('./task-instructions');
const ExtHooksMap = require('./ext-hooks');

const dbg = (data) => {
  let s = '';
  data.forEach((el, i) => {
    s += `${(i != 0 ? ' ' : '>> ')}${el.toString(16).padStart(2, '0')}`;
  });

  console.log(s);

  return s;
};

const parseAGVStatus = (data) => {
  const { response: buf = false } = data;
  let ret = [];

  if (buf && buf instanceof Buffer) {
    // response code
    const type = buf[5];

    // TODO: improve
    if (type == 0x61) {
      // Basic state, page 1
      // - TBA
      // dbg(buf);
    } else if (type == 0x62) {
      // Basic state, page 2
      const labels = [
        'Voltage',
        'Remaining capaticy',
        'Battery temperature',
        'Battery current',
      ];
      let k = 0;
      for (let i = 6; i < 14; i += 2) {
        const byte = buf.readInt16LE(i);
        const o = {};
        o[labels[k]] = byte;
        ret.push(o);
        k++;
      }
    } else if (type == 0x67) {
      // Digital I/O
      let k = 0;
      for (let i = 6; i < 22; i++) {
        const byte = buf[i];

        for (let j = 0; j < 8; j++) {
          ret.push({
            label: `${(k >= 64) ? 'out_' : 'in_'}${(k % 64) + j}`,
            value: (byte & (0x01 << j)) != 0
          });
        }
        k += 8;
      }
    } else if (type == 0x68) {
      // Navi state, page 1
      // - TBA
      // dbg(buf);
    } else if (type == 0x6d) {
      // Navi state, page 2
      // - TBA
      // dbg(buf);
    } else if (type == 0x80) {
      // Task monitor
      ret.push(
        {
          label: 'Task chain ID',
          value: buf.readInt16LE(8)
        },
        {
          label: 'Current row',
          value: buf.readInt16LE(10)
        },
        {
          label: 'Running',
          value: buf[6]
        },
      );
    } else if (type == 0x95) {
      // Landmark history record
      for (let i = 8; i < 47; i += 2) {
        const byte = buf.readInt16LE(i);
        ret.push(byte);
      }
    } else {
      // ...
      dbg(buf);
    }
  }

  return ret;
};

const getAGVTaskInstructions = () => {
  return TaskInstructionsMap.map((inst) => {
    const { name, code, argDefault, decoder } = inst;
    return {
      name, code, data: decoder(Buffer.from(argDefault))
    };
  });
};

const decodeAGVTaskInstructinos = (data) => {
  let i = 0;
  const instructions = [];

  while (i < data.length) {
    const inst = TaskInstructionsMap.find(el => el.code == data[i]);
    if (inst) {
      const { name, code, argSize, decoder } = inst;
      instructions.push({
        name,
        code,
        data: decoder(data.subarray(i + 1, i + 1 + argSize)),
        // hook: { test: instructions.length }
      });
      i += (argSize + 1);
    } else {
      // ..?
      i++;
    }
  }

  return instructions;
};

const decodeAGVTasks = (data) => {
  let bct = 6;
  let i = 0;
  const tasks = [];

  while (bct < data.length) {
    const task = data.subarray(bct, bct + 256);
    tasks.push({ label: `task_${i}`, task });
    i++;
    bct += 256;
  }

  for (let j = 0; j < tasks.length; j++) {
    tasks[j].data = decodeAGVTaskInstructinos(tasks[j].task);
  }

  return tasks;
};

const encodeAGVTaskInstructinos = (data) => {
  let rbuf;

  if (data.length == 0) {
    rbuf = Buffer.alloc(256);
  } else {
    const instructions = [];

    for (let el of data) {
      const { code, data: argData } = el;
      const inst = TaskInstructionsMap.find(el => el.code == code);
      const { encoder } = inst;
      instructions.push(encoder(argData));
    }

    rbuf = Buffer.concat(instructions, 256);
  }

  return rbuf;
};

const encodeAGVTasks = (data, target = 'buffer') => {
  if (target == 'buffer') {
    const tasks = [];

    for (let task of data) {
      const { data: fromClient } = task;
      tasks.push(encodeAGVTaskInstructinos(fromClient));
    }

    return tasks;
  } else {
    const tmpJSON = {};

    for (let task of data) {
      const { label, data: fromClient } = task;
      tmpJSON[label] = fromClient;
    }

    return tmpJSON;
  }
};

const getAGVExternalHooks = (saved) => {
  //..
  const hooks = [];

  ExtHooksMap.forEach((el) => {
    const {
      name, code,
      conditions: oConditions,
      actions: oActions
    } = el;

    const actions = oActions.map((iel) => {
      const { name, code, argDefault, decoder } = iel;
      return {
        name, code, data: decoder(argDefault)
      };
    });

    const conditions = oConditions.map((iel) => {
      const { name, code, argDefault, decoder } = iel;
      return {
        name, code, data: decoder(argDefault, code)
      };
    });

    hooks.push({ name, code, conditions, actions });

    // NOTE: default data
    saved ||= { [code]: [] };
    saved[code] ||= [];
  });

  //..

  return { hooks, saved };
};

// TODO: improve
const testSingleInput = (cond, input) => {
  let ret = false;
  const [op, comp] = cond;
  const opEntry = op.options
    .map((el) => Object.entries(el)[0])
    .find((el) => { return el[1] == op.value; });

  if (opEntry) {
    switch (opEntry[0]) {
      case '==':
        ret = (comp.value == input);
        break;
      case '!=':
        ret = (comp.value != input);
        break;
      case '>':
        ret = (comp.value > input);
        break;
      case '>=':
        ret = (comp.value >= input);
        break;
      case '<':
        ret = (comp.value < input);
        break;
      case '<=':
        ret = (comp.value <= input);
        break;
      default:
        break;
    }
  }

  return ret;
};

const testMultiInput = (cond, input1, input2) => {
  let ret = false;
  const result = [];
  const [op1, comp1, op2, comp2] = cond;
  [[op1, comp1, input1], [op2, comp2, input2]].forEach((entries) => {
    const [op, comp, input] = entries;
    const opEntry = op.options
      .map((el) => Object.entries(el)[0])
      .find((el) => { return el[1] == op.value; });

    if (opEntry) {
      switch (opEntry[0]) {
        case '==':
          result.push(comp.value == input);
          break;
        case '!=':
          result.push(comp.value != input);
          break;
        case '>':
          result.push(comp.value > input);
          break;
        case '>=':
          result.push(comp.value >= input);
          break;
        case '<':
          result.push(comp.value < input);
          break;
        case '<=':
          result.push(comp.value <= input);
          break;
        default:
          break;
      }
    }
  });

  if (result.length > 0) ret = result.every(el => el);

  return ret;
};

const processAGVExternalHooks = (processor, tag, data) => {
  // TODO: should be able to process a variety of actions

  if (tag == 'landmarkHistoryRecord') {
    const { landmarkHistoryRecord : source } = processor.store.data;
    const { log, prev, current } = data;
    // console.log(tag, log, prev, current, source);

    // NOTE: test case = 'last'
    const cond1 = source.filter((el) => el.rel == 'last');
    cond1.forEach((c) => {
      const { code: action, data: actionData, condition } = c;
      if (testSingleInput(condition, current)) {
        const [ad = { value: 0 }] = actionData;
        console.log('emit by hooks', 'vout', [action, ad.value]);
        processor.emit('vout', [action, ad.value]);
      }
    });

    // NOTE: test case = 'last_two'
    const cond2 = source.filter((el) => el.rel == 'last_two');
    cond2.forEach((c) => {
      const { code: action, data: actionData, condition } = c;
      if (testMultiInput(condition, current, prev)) {
        const [ad = { value: 0 }] = actionData;
        console.log('emit by hooks', 'vout', [action, ad.value]);
        processor.emit('vout', [action, ad.value]);
      }
    });

    // TODO: other cases
    // ...
  } else if (tag == 'taskMonitor') {
    const { taskMonitor : source } = processor.store.data;
    const { taskChainId, prev, current } = data;

    // NOTE: test case = 'current'
    const cond1 = source.filter((el) => el.rel == 'current');
    cond1.forEach((c) => {
      const { code: action, data: actionData, condition } = c;
      if (testSingleInput(condition, current)) {
        const [ad = { value: 0 }] = actionData;
        console.log('emit by hooks', 'vout', [action, ad.value]);
        processor.emit('vout', [action, ad.value]);
      }
    });
  }
};

module.exports = {
  parseAGVStatus,
  getAGVTaskInstructions, decodeAGVTasks, encodeAGVTasks,
  getAGVExternalHooks, processAGVExternalHooks
};
