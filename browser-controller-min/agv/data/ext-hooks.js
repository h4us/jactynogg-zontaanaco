// TODO: improve

const actions = [
  {
    name: 'Lift up',
    code: 1,
    help: '',
    argSize: 1,
    argDefault: [0],
    encoder: (argData) => {},
    decoder: (data) => {
      return [
        {
          label: 'timeout',
          type: 'number',
          value: data[0]
        }
      ];
    }
  },
  {
    name: 'Lift down',
    code: -1,
    help: '',
    argSize: 1,
    argDefault: [0],
    encoder: (argData) => {},
    decoder: (data) => {
      return [
        {
          label: 'timeout',
          type: 'number',
          value: data[0]
        }
      ];
    }
  }
];

module.exports = [
  {
    name: 'Digital I/O State',
    code: 'digitalState',
    conditions: [
      {
        name: 'On',
        code: 'on',
        help: '',
        argSize: 1,
        argDefault: [0, 0],
        encoder: (argData) => {},
        decoder: (data, rel = null) => {
          return [
            {
              label: 'type',
              type: 'select',
              options: [
                { 'In': 0 },
                { 'Out': 1 },
                { 'Virtual': 2 },
              ],
              value: data[0],
              rel
            },
            {
              label: 'id',
              type: 'number',
              value: data[1],
              rel
            }
          ];
        }
      },
      {
        name: 'Off',
        code: 'off',
        help: '',
        argSize: 1,
        argDefault: [0, 0],
        encoder: (argData) => {},
        decoder: (data, rel = null) => {
          return [
            {
              label: 'type',
              type: 'select',
              options: [
                { 'In': 0 },
                { 'Out': 1 },
                { 'Virtual': 2 },
              ],
              value: data[0],
              rel
            },
            {
              label: 'id',
              type: 'number',
              value: data[1],
              rel
            }
          ];
        }
      },
    ],
    actions
  },

  {
    name: 'Landmark History (RFID) Record',
    code: 'landmarkHistoryRecord',
    conditions: [
      {
        name: 'Last',
        code: 'last',
        help: '',
        argSize: 2,
        argDefault: [0, 0],
        encoder: (argData) => {},
        decoder: (data, rel = null) => {
          return [
            {
              label: 'operator',
              type: 'select',
              options: [
                { '==': 0 },
                { '!=': 1 },
                { '>': 2 },
                { '>=': 3 },
                { '<': 4 },
                { '<=': 5 }
              ],
              value: data[0],
              rel
            },
            {
              label: 'id',
              type: 'number',
              value: data[1],
              rel
            }
          ];
        }
      },
      {
        name: 'Last two',
        code: 'last_two',
        help: '',
        argSize: 4,
        argDefault: [0, 0, 0, 0],
        encoder: (argData) => {},
        decoder: (data, rel = null) => {
          return [
            {
              label: 'operator_current',
              type: 'select',
              options: [
                { '==': 0 },
                { '!=': 1 },
                { '>': 2 },
                { '>=': 3 },
                { '<': 4 },
                { '<=': 5 }
              ],
              value: data[0],
              rel
            },
            {
              label: 'id_current',
              type: 'number',
              value: data[1],
              rel
            },
            {
              label: 'operator_prev',
              type: 'select',
              options: [
                { '==': 0 },
                { '!=': 1 },
                { '>': 2 },
                { '>=': 3 },
                { '<': 4 },
                { '<=': 5 }
              ],
              value: data[2],
              rel
            },
            {
              label: 'id_prev',
              type: 'number',
              value: data[3],
              rel
            }
          ];
        }
      }
    ],
    actions
  },
  {
    name: 'Task Monitor',
    code: 'taskMonitor',
    conditions: [
      {
        name: 'Current',
        code: 'current',
        help: '',
        argSize: 2,
        argDefault: [0, 0],
        encoder: (argData) => {},
        decoder: (data, rel = null) => {
          return [
            {
              label: 'operator',
              type: 'select',
              options: [
                { '==': 0 },
                { '!=': 1 },
                { '>': 2 },
                { '>=': 3 },
                { '<': 4 },
                { '<=': 5 }
              ],
              value: data[0],
              rel
            },
            {
              label: 'row_index',
              type: 'number',
              value: data[1],
              rel
            }
          ];
        }
      }
    ],
    actions
  }
];
