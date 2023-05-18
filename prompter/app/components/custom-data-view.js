import {
  useState, useEffect, useImperativeHandle,
  forwardRef,
  Fragment
} from 'react';

export function RecallableCellRenderer(props) {
  const {
    value: argData = [],
    cbRecall = () => {},
    cbPreview = () => {},
    type
  } = props;

  const handleClickRecall = _ => {
    const [data, name] = argData;
    cbRecall(type, data);
  };

  const handleClickPreview = _ => {
    const [data, name] = argData;
    cbPreview(type, name);
  };

  return (
    <div className="inline-flex w-full justify-center gap-3">
      <button
        className="btn btn-primary btn-sm w-full sm:w-auto"
        onClick={handleClickRecall}>recall</button>
      <button
        className="btn btn-ghost btn-sm w-full sm:w-auto"
        onClick={handleClickPreview}>preview</button>
    </div>
  );
}

export function InstructionCellRenderer(props) {
  const { value: argData = [] } = props;

  const validate = (item) => {
    //
    let ret = <span className="text-red-500">Invalid value ({item.value})</span>;

    //
    if (item.type == 'select') {
      const matched = item.options.find(iel => Object.values(iel)[0] == item.value);
      if (matched) {
        ret = <span className="text-blue-500">{Object.keys(matched)[0]}</span>;
      }
    } else {
      ret = <span className="text-blue-500">{item.value}</span>;
    }

    return ret;
  };

  return (
    <dl className='flex'>
      {
        argData.map((el, i) => (
          el.type !== 'constant' && <Fragment key={i}>
            <dt className='italic'>{el.label}</dt>
            <dd className='mr-3'>
              <span className='mx-1'>:</span>
              { validate(el) }
            </dd>
          </Fragment>
        ))
      }
    </dl>
  );
}

// const KEY_BACKSPACE = 'Backspace';
// const KEY_DELETE = 'Delete';
// const KEY_ENTER = 'Enter';
// const KEY_TAB = 'Tab';

export const InstructionCellEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);

  const cancelBeforeStart =
    props.charPress && '1234567890'.indexOf(props.charPress) < 0;

  // const isLeftOrRight = (event) => {
  //   return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
  // };

  // const isCharNumeric = (charStr) => {
  //   return !!/\d/.test(charStr);
  // };

  // const isKeyPressedNumeric = (event) => {
  //   const charStr = event.key;
  //   return isCharNumeric(charStr);
  // };

  // const deleteOrBackspace = (event) => {
  //   return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1;
  // };

  // const finishedEditingPressed = (event) => {
  //   const key = event.key;
  //   return key === KEY_ENTER || key === KEY_TAB;
  // };

  // const onKeyDown = (event) => {
  //   if (isLeftOrRight(event) || deleteOrBackspace(event)) {
  //     event.stopPropagation();
  //     return;
  //   }

  //   if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
  //     if (event.preventDefault) event.preventDefault();
  //   }
  // };

  const handleSelectChange = (i, e) => {
    // TODO:
    setValue((pv) => {
      const nv = [...pv];
      nv[i].value = e.target.value;
      return nv;
    });
  };

  const handleInputChange = (i, e) => {
    // TODO:
    setValue((pv) => {
      const nv = [...pv];
      if (nv[i].type == 'number') {
        if (!Number.isNaN(parseInt(e.target.value))) {
          nv[i].value = parseInt(e.target.value);
        }
      } else {
        nv[i].value = e.target.value;
      }
      return nv;
    });
  };

  const prepareInputs = (index, item) => {
    let ret = <span className="text-red-500">Invalid value ({item.value})</span>;

    if (item.type == 'select') {
      const matched = item.options.find(iel => Object.values(iel)[0] == item.value);
      if (matched) {
        ret = (
          <select
            className="select select-sm select-ghost"
            onChange={(e) => handleSelectChange(index, e)}
            defaultValue={Object.values(matched)[0]}>
            {
              item.options.map((el, i) =>
                <option key={i} value={Object.values(el)[0]}>{Object.keys(el)[0]}</option>
              )
            }
          </select>
        );
      }
    } else {
      ret = (
        <input
          className="input input-sm input-ghost"
          disabled={item.type == 'constant'}
          onChange={(e) => handleInputChange(index, e)}
          defaultValue={item.value} />
      );
    }

    return ret;
  };

  // ?
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },

      isCancelBeforeStart() {
        return cancelBeforeStart;
      },

      isCancelAfterEnd() {
        return value > 1000000;
      },
    };
  });

  return (
    <div className="p-2">
      {
        props.value?.map((el, i) => (
          <dl
            className="flex items-center my-2"
            key={i}>
            <dt className='italic'>{el.label}</dt>
            <dd className='mr-3'>
              <span className='mx-1'>:</span>
              {prepareInputs(i, el)}
            </dd>
          </dl>
        ))
      }
    </div>
  );
});
