module.exports = [
  {
    code: 0x0b,
    name: 'SetButton',
    help: 'Trigger button',
    argSize: 2,
    argDefault: [0x01, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x0b,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'trigger_type',
          type: 'select',
          options: [
            { start: 0x00 },
            { stop: 0x01 }
          ],
          value: data[0]
        },
        {
          type: 'constant',
          value: data[1]
        }
      ];
    }
  },
  {
    code: 0x01,
    name: 'Set light mode',
    help: 'Set the lighting output behavior',
    argSize: 3,
    argDefault: [0x20, 0x20, 0x20],
    encoder: (argData) => {
      return Buffer.from([
        0x01,
        argData[0].value, argData[1].value, argData[3].value
      ]);
    },
    decoder: (data) => {
      const options = [
        { 'No Action': 0x20 },
        { 'Open': 0x21 },
        { 'Shut down': 0x22 },
        { 'Slow flash': 0x23 },
        { 'Flash': 0x24 }
      ];
      const ret = [];
      ['red', 'green', 'blue'].forEach((v, i) => {
        ret.push({
          label: `${v}_light_action`,
          type: 'select',
          options,
          value: data[i]
        });
      });
      return ret;
    }
  },
  {
    code: 0x02,
    name: 'Set IO output',
    help: 'Set IO output behavior',
    argSize: 2,
    argDefault: [0x00, 0x20],
    encoder: (argData) => {
      return Buffer.from([
        0x02,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'io_object',
          type: 'number',
          value: data[0]
        },
        {
          label: 'io_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Switch': 0x21 },
            { 'Shut down': 0x22 },
            { 'Open': 0x23 }
          ],
          value: data[1]
        },
      ];
    }
  },
  {
    code: 0x03,
    name: 'Set broadcast sound',
    help: 'Set broadcast sound',
    argSize: 2,
    argDefault: [0x20, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x03,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'sound_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Stop play': 0x21 },
            { 'Start play': 0x22 }
          ],
          value: data[0]
        },
        {
          label: 'music',
          type: 'number',
          value: data[1]
        }
      ];
    }
  },
  {
    code: 0x04,
    name: 'Fork selection',
    help: 'Mandatory setting of turn behavior, note: this command priority is highest.',
    argSize: 1,
    argDefault: [0x20],
    encoder: (argData) => {
      return Buffer.from([
        0x04,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'fork_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Turn left': 0x21 },
            { 'Turn right': 0x22 },
            { 'Go straight': 0x23 },
            { 'Turn 90deg anti-clockwise': 0x24 },
            { 'Turn 180deg anti-clockwise': 0x25 },
            { 'Turn 90deg clockwise': 0x26 },
            { 'Turn 180deg clockwise': 0x27 },
          ],
          value: data[0]
        },
      ];
    }
  },
  {
    code: 0x0a,
    name: 'Set the obstacle avoididance type',
    help: 'Set the obstacle avoididance type',
    argSize: 2,
    argDefault: [0x20, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x0a,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'obstacle_avoididance_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Lock channel type': 0x21 },
            { 'Release channel selection': 0x22 }
          ],
          value: data[0]
        },
        {
          // TODO: limits
          label: 'type_of_obstacle_avoididance',
          type: 'number',
          value: data[1]
        }
      ];
    }
  },
  {
    code: 0x05,
    name: 'Set speed level',
    help: 'Set speed level',
    argSize: 2,
    argDefault: [0x20, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x05,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'speed_level_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'System default': 0x21 },
            { 'Set speed level': 0x22 },
          ],
          value: data[0]
        },
        {
          // TODO: limits
          label: 'speed_level',
          type: 'number',
          value: data[1]
        }
      ];
    }
  },
  {
    code: 0x06,
    name: 'Set control mode',
    help: 'Set control mode',
    argSize: 1,
    argDefault: [0x20],
    encoder: (argData) => {
      return Buffer.from([
        0x06,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'mode_setting',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Map control mode': 0x21 },
            { 'Track mode': 0x22 },
            { 'Free navi mode': 0x23 },
            { 'Force turn mode': 0x24 },
          ],
          value: data[0]
        }
      ];
    }
  },
  {
    code: 0x07,
    name: 'Navigation initialization',
    help: 'Navigation initialization',
    argSize: 7,
    argDefault: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    encoder: (argData) => {
      const buf = Buffer.alloc(8);
      buf[0] = 0x07;
      buf[1] = argData[0].value;
      buf[2] = argData[1].value;
      buf.writeInt16LE(argData[2].value, 3);
      buf.writeInt16LE(argData[3].value, 5);
      buf[7] = argData[4].value;
      return buf;
    },
    decoder: (data) => {
      return [
        {
          type: 'constant',
          value: data[0]
        },
        {
          label: 'location_type',
          type: 'select',
          options: [
            { 'Automatic positioning': 0x00 },
            { 'Locate manualy': 0x01 },
          ],
          value: data[1]
        },
        {
          // TODO: limits
          label: 'location_1',
          type: 'number',
          value: data.readInt16LE(2)
        },
        {
          // TODO: limits
          label: 'location_2',
          type: 'number',
          value: data.readInt16LE(4)
        },
        {
          label: 'direction',
          type: 'select',
          options: [
            { 'Positive direction': 0x00 },
            { 'Negative direction': 0x01 },
          ],
          value: data[6]
        },
      ];
    }
  },
  // TBA
  /* {
    code: 0x1e,
    name: 'Setting Code',
    help: 'Set real-time task chain user status code',
    argSize: 2,
    argDefault: [0x00, 0x00], // NOTE: number<Int16LE>
    encoder: () => {},
    decoder: () => {}
  }, */
  {
    code: 0x16,
    name: 'Alignment',
    help: 'Open alignment or close alignment function',
    argSize: 3,
    argDefault: [0x20, 0x00, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x16,
        argData[0].value,
        argData[1].value,
        argData[2].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'alignment_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { '_UNRESOLVE_STATE_1_': 0x21 },
            { '_UNRESOLVE_STATE_2_': 0x22 },
            { 'Close alignment': 0x23 },
          ],
          value: data[0]
        },
        {
          label: 'alignment_target?',
          type: 'number',
          value: data[1]
        },
        {
          label: 'alignment_condition?',
          type: 'number',
          value: data[2]
        }
      ];
    }
  },
  {
    code: 0x08,
    name: 'Navigation target',
    help: 'Set or cancel navigation targets',
    argSize: 3,
    argDefault: [0x20, 0x00, 0x00],
    encoder: (argData) => {
      const buf = Buffer.alloc(4);
      buf[0] = 0x08;
      buf[1] = argData[0].value;
      buf.writeInt16LE(argData[1].value, 2);
      return buf;
    },
    decoder: (data) => {
      return [
        {
          label: 'navigation_action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Update the target': 0x21 },
            { 'Cancel the navigation': 0x22 },
          ],
          value: data[0]
        },
        {
          // TODO: limits
          label: 'target',
          type: 'number',
          value: data.readInt16LE(1)
        }
      ];
    }
  },
  {
    code: 0x17,
    name: 'TempTarget Operation',
    help: 'TempTarget Operation',
    argSize: 3,
    argDefault: [0x00, 0x00, 0x00],
    encoder: (argData) => {
      const buf = Buffer.alloc(4);
      buf[0] = 0x17;
      buf[1] = argData[0].value;
      buf.writeInt16LE(argData[1].value, 2);
      return buf;
    },
    decoder: (data) => {
      return [
        {
          label: 'operation_type',
          type: 'select',
          options: [
            { 'Add target': 0x00 },
            { 'Remove target': 0x01 },
            { 'Remove all': 0x02 },
          ],
          value: data[0]
        },
        {
          // TODO: limits
          label: 'target',
          type: 'number',
          value: data.readInt16LE(1)
        }
      ];
    }
  },
  {
    code: 0x18,
    name: 'Set Direction',
    help: 'Intial AGV moving direction',
    argSize: 1,
    argDefault: [0x20],
    encoder: (argData) => {
      return Buffer.from([
        0x18,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'mode_setting',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Positive Direction': 0x21 },
            { 'Back': 0x22 },
            { 'Left': 0x23 },
            { 'Right': 0x24 },
            { 'Change direction': 0x24 },
          ],
          value: data[0]
        }
      ];
    }
  },
  {
    code: 0x19,
    name: 'Set Table',
    help: 'Switch work table',
    argSize: 2,
    argDefault: [0x20, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x19,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'action',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'Active table': 0x21 },
            { 'Disable table': 0x22 }
          ],
          value: data[0]
        },
        {
          label: 'table',
          type: 'number',
          value: data[1]
        }
      ];
    }
  },
  {
    code: 0x1a,
    name: 'Jump',
    help: 'Jump instruction',
    argSize: 1,
    argDefault: [0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x1a,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          // TODO: limits
          label: 'jump_to_line',
          type: 'number',
          value: data[0]
        }
      ];
    }
  },
  {
    code: 0x1b,
    name: 'Task chain call',
    help: 'Task chain call instructions, call the task chain back to the task chain continue to point down',
    argSize: 2,
    argDefault: [0x00, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x1b,
        argData[0].value, argData[1].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          // TODO: limits, format
          label: 'call_the_task_chain_id',
          type: 'number',
          value: data[0]
        },
        {
          // TODO: limits
          label: 'entry',
          type: 'number',
          value: data[1]
        }
      ];
    }
  },
  {
    code: 0x1c,
    name: 'Script calls',
    help: 'After the call to this task chain to continue down the execution',
    argSize: 1,
    argDefault: [0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x1c,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          // TODO: format
          label: 'function_name',
          type: 'number',
          value: data[0]
        }
      ];
    }
  },
  {
    code: 0x0e,
    name: 'Wait for IO state',
    help: 'Wait for IO state',
    argSize: 3,
    argDefault: [0x20, 0x00, 0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x0e,
        argData[0].value, argData[1].value, argData[2].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'io_types',
          type: 'select',
          options: [
            { 'No Action': 0x20 },
            { 'System default': 0x21 },
          ],
          value: data[0]
        },
        {
          // TODO: limits
          label: 'io_number',
          type: 'number',
          value: data[1]
        },
        {
          label: 'wait_for_io_state',
          type: 'select',
          options: [
            { 'No signal': 0x00 },
            { 'Active': 0x01 },
          ],
          value: data[2]
        },
      ];
    }
  },
  {
    code: 0x0c,
    name: 'Delay',
    help: 'Delay',
    argSize: 4,
    argDefault: [0x00, 0x00, 0x00, 0x00],
    encoder: (argData) => {
      const buf = Buffer.alloc(5);
      buf[0] = 0x0c;
      buf.writeInt32LE(argData[0].value, 1);
      return buf;
    },
    decoder: (data) => {
      return [
        {
          // TODO: limits
          label: 'delay_time_seconds',
          type: 'number',
          value: data.readInt32LE(0)
        }
      ];
    }
  },
  {
    code: 0x10,
    name: 'Wait target reach',
    help: 'Wait for the robot to pass through the registration point',
    argSize: 2,
    argDefault: [0x00, 0x00],
    encoder: (argData) => {
      const buf = Buffer.alloc(3);
      buf[0] = 0x10;
      buf.writeInt16LE(argData[0].value, 1);
      return buf;
    },
    decoder: (data) => {
      return [
        {
          // TODO: limits
          label: 'location_number_to_wait_for',
          type: 'number',
          value: data.readInt16LE(0)
        }
      ];
    }
  },
  {
    code: 0x0f,
    name: 'Wait for system status',
    help: 'Wait for the robot to be in the specified state',
    argSize: 1,
    argDefault: [0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x0f,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          label: 'the_state_of_the_system_that_needs_to_wait',
          type: 'select',
          options: [
            { 'System is stop': 0x00 },
            { 'System is running': 0x01 },
          ],
          value: data[0]
        }
      ];
    }
  },
  {
    code: 0x0d,
    name: 'Waiting start command',
    help: 'Wait until the start button is pressed',
    argSize: 1,
    argDefault: [0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x0d,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          type: 'constant',
          value: data[0]
        }
      ];
    }
  },
  {
    code: 0x09,
    name: 'Navigation target in place',
    help: 'Set the navigation target and wait for the task to end',
    argSize: 3,
    argDefault: [0x00, 0x00, 0x00],
    encoder: (argData) => {
      const buf = Buffer.alloc(4);
      buf[0] = 0x09;
      buf[1] = argData[0].value;
      buf.writeInt16LE(argData[1].value, 2);
      return buf;
    },
    decoder: (data) => {
      return [
        {
          type: 'constant',
          value: data[0]
        },
        {
          // TODO: limits
          label: 'target',
          type: 'number',
          value: data.readInt16LE(1)
        }
      ];
    }
  },
  {
    code: 0x1d,
    name: 'WaitScript',
    help: 'WaitScript',
    argSize: 1,
    argDefault: [0x00],
    encoder: (argData) => {
      return Buffer.from([
        0x1d,
        argData[0].value
      ]);
    },
    decoder: (data) => {
      return [
        {
          type: 'constant',
          value: data[0]
        }
      ];
    }
  },
  // TBA
  /* {
    code: 0x1f,
    name: 'Waiting for the command table',
    help: 'Waiting for the current command table to finish running',
    argSize: 1,
    argDefault: [0xc1], // NOTE: constant
    encoder: () => {},
    decoder: () => {}
  } */
];
