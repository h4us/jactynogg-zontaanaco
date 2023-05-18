import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

// TODO:
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
  InstructionCellRenderer,
  InstructionCellEditor
} from '../components/custom-data-view';

export default function Tasks() {
  const router = useRouter();

  // TODO: tracking
  const socketRef = useRef();

  const tasklinkRef = useRef();
  const [taskLabels, setTaskLabels] = useState([]);

  const instructionRef = useRef();
  const [taskInstructions, setTaskInstructions] = useState([]);

  const gridRef = useRef();
  const srcDataRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      // TODO:
      headerName: '',
      valueGetter: 'node.rowIndex',
      maxWidth: 100,
      resizable: false
    },
    {
      field: 'name',
      headerName: 'Instruction',
      filter: true, rowDrag: true, minWidth: 200, width: 240
    },
    {
      field: 'data',
      headerName: 'Parameters',
      editable: true,
      cellRenderer: InstructionCellRenderer,
      cellEditor:  InstructionCellEditor,
      cellEditorPopup: true,
    }
  ]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    lockPosition: 'left',
    flex: 1
  }));

  const updateSrcData = useCallback(() => {
    const tskl = parseInt(tasklinkRef.current.value);
    if (tskl >= 0) {
      const c = srcDataRef.current[tskl];
      const { label, task } = c;

      const updated = [];
      gridRef.current.api.forEachNode((node) => {
        updated.push(node.data);
      });
      srcDataRef.current[tskl] = { label, task, data: updated };

      // TODO:
      gridRef.current.api.refreshCells();
    }
  }, []);

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    const res = gridRef.current.api.applyTransaction({
      remove: selectedData
    });

    const { remove = [] } = res;
    if (remove.length > 0) updateSrcData();
  }, []);

  const onAddInstruction = useCallback(() => {
    let addIndex;
    const selectedData = gridRef.current.api.getSelectedNodes();
    if (selectedData.length > 0) {
      addIndex = selectedData.pop().rowIndex;
    }

    const inst = parseInt(instructionRef.current.value);

    if (inst >= 0) {
      const toAdd = Object.assign({}, { ...taskInstructions[inst] });
      const res = gridRef.current.api.applyTransaction({
        add: [toAdd],
        addIndex: addIndex,
      });

      const { add = [] } = res;
      if (add.length > 0) updateSrcData();
    }
  }, [taskInstructions]);

  const handleTaskSelect = (e) => {
    if (srcDataRef.current) {
      setRowData(srcDataRef.current[parseInt(e.target.value)].data);
    }
  };

  const handleUpload = async (presetName = false) => {
    const res = await window.fetch(presetName ? `/tzbot/tasks?preset=${presetName}` : '/tzbot/tasks');
    const rjson = await res.json();
    console.log(rjson);
    const { data = '' } = rjson;

    if (data.length > 0) {
      setTaskLabels(data.map((el, i) => ({ label: el.label, val: i })));
      srcDataRef.current = data;
      if (tasklinkRef.current) tasklinkRef.current.value = 0;
      setRowData(srcDataRef.current[0].data);
    }
  };

  const handleDownload = async () => {
    if (srcDataRef.current) {
      window.fetch('/tzbot/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(srcDataRef.current)
      });
    }
  };

  const handleTemplateOut = async () => {
    if (srcDataRef.current) {
      const res = await window.fetch('/tzbot/tasks?template=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(srcDataRef.current)
      });

      const rjson = await res.json();
      console.log(rjson);
    }
  };

  const handleFileOpen = async () => {
    const fopen = async () => {
      return new Promise((resolve, reject) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
          let files = Array.from(input.files);
          if (files && files.length > 0) {
            resolve(files[0]);
          } else {
            reject(false);
          }
        };
        input.click();
      });
    };

    let fp = false;
    try {
      fp = await fopen();
    } catch(err) {
      console.error(err);
    }

    if (fp) {
      const payload = new FormData();
      payload.append('data', fp, 'data.tasklink');
      const res = await window.fetch('/tzbot/tasks?file=1', {
        method: 'POST',
        body: payload
      });

      const rjson = await res.json();
      const { data = '' } = rjson;
      if (data.length > 0) {
        setTaskLabels(data.map((el, i) => ({ label: el.label, val: i })));
        srcDataRef.current = data;
        if (tasklinkRef.current) tasklinkRef.current.value = 0;
        setRowData(srcDataRef.current[0].data);
      }
    }
  };

  useEffect(() => {
    const { src } = router.query;
    const onMounted = async () => {
      const res = await window.fetch('/tzbot/tasks/instructions');
      const rjson = await res.json();
      setTaskInstructions(rjson);
      handleUpload(src);
    };
    onMounted();
  }, [router]);

  // useEffect(() => {
  //   const onMounted = async () => {
  //     const res = await window.fetch('/tzbot/tasks/instructions');
  //     const rjson = await res.json();
  //     setTaskInstructions(rjson);
  //     handleUpload();
  //   };
  //   onMounted();
  // }, []);

  return (
    <>
      <div className="w-full mt-[9vh] sm:mt-[6vh] px-2 py-4 ag-theme-alpine" style={{ height: '90vh' }}>
        <nav className='mb-2 flex flex-wrap gap-3'>
          <select
            ref={tasklinkRef}
            className='select select-bordered select-sm w-full sm:w-auto'
            defaultValue={-1}
            onChange={handleTaskSelect}>
            <option disabled value={-1}>Tasks</option>
            {
              taskLabels.map((el, i) =>
                <option key={i} value={el.val}>{el.label}</option>
              )
            }
          </select>

          <div className="flex w-full justify-between gap-x-1 gap-y-2 w-full sm:w-auto">
            <select
              className='select select-bordered select-sm w-1/2 sm:w-auto'
              ref={instructionRef}
              defaultValue={-1}>
              <option disabled value={-1}>Instructions</option>
              {
                taskInstructions.map((el, i) =>
                  <option key={i} value={i}>{el.name}</option>
                )
              }
            </select>
            <button
              className='btn btn-outline btn-sm shrink w-full sm:w-auto'
              onClick={onAddInstruction}>Add</button>
          </div>

          <button
            className='btn btn-outline btn-sm w-full sm:w-auto'
            onClick={onRemoveSelected}>Remove</button>

          <button
            className="btn btn-primary btn-sm w-full sm:w-auto"
            onClick={handleUpload}>Upload</button>
          <button
            className="btn btn-secondary btn-sm w-full sm:w-auto"
            onClick={handleDownload}>Download</button>
          {/* <button */}
          {/*   className="btn btn-ghost btn-sm w-full sm:w-auto" */}
          {/*   onClick={handleFileOpen}>Load from file</button> */}
          <button
            className="btn btn-ghost btn-sm w-full sm:w-auto"
            onClick={handleTemplateOut}>Make template</button>
        </nav>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowDragManaged={true}
          rowSelection='multiple'
          onRowDragEnd={updateSrcData}
        />
      </div>
    </>
  );
}
