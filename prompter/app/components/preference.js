'use client'

import { useEffect, useRef, useState, useMemo } from "react";

import { useControls, button, folder, Leva } from 'leva';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
  InstructionCellRenderer,
  InstructionCellEditor
} from '@/app/components/custom-data-view';

export default function Preference() {
  const socketRef = useRef();
  const [admin, setAdmin] = useState(false);

  const [version, setVersion] = useState('');
  const stateRef = useRef(0);
  const callerRef = useRef({});

  const gridRef = useRef();
  // const srcDataRef = useRef();
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

  const [ctl, setCtl] = useControls(() => ({
    "Preference": folder({
      'Interval': folder({
        callType: {
          value: 0,
          options: { 'skip': 0, 'range': 1 },
          onChange: (v) => {
            callerRef.current = Object.assign(callerRef.current, { type: v });
          }
        },
        callTarget: {
          value: 0,
          step: 1, min: 0, max: 255,
          onChange: (v) => {
            callerRef.current = Object.assign(callerRef.current, { target: v });
          }
        },
        send: button((api) => {
          const { type, target } = callerRef.current;
          window.fetch(`/tzbot/remotecall/${type}/${target}`);
        }),
        skip: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ rqInterval: 'skip' })
          });
        }),
        default: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ rqInterval: ['random', 1000, 5000] })
          });
        }),
        // rand
        short_rand: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ rqInterval: ['random', 50, 2000] })
          });
        }),
        long_rand: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ rqInterval: ['random', 2000, 3000 * 10] })
          });
        }),
        // sample
        sample1: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              rqInterval: [
                'sample',
                100, 300, 600, 1000, 3 * 1000, 6 * 1000, 12 * 1000
              ]
            })
          });
        }),
        sample2: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              rqInterval: [
                'sample',
                1000, 3 * 1000, 5 * 1000, 8 * 1000, 9 * 1000
              ]
            })
          });
        }),
        sample3: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              rqInterval: [
                'sample',
                5 * 1000, 10 * 1000, 15 * 1000, 3 * 1000, 500, 6 * 1000, 12 * 1000
              ]
            })
          });
        }),
      }),
      'Presets': folder({
        p1: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              userTextSources: [
                `次の文章を50語以内で日本語でもっと具体的にして: `,
              ]
            })
          });
        }),
        p2: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              userTextSources: [
                `次の文章を50語以内で日本語でもっと具体的にして: `,
                `次の文章を50語以内で日本語でもっと悲しくして: `,
              ]
            })
          });
        }),
        p3: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              userTextSources: [
                `次の文章を50語以内で日本語でもっと具体的にして: `,
                `次の文章を50語以内で日本語でもっと悲しくして: `,
                `次の文章を50語以内で日本語でもっと楽しくして: `,
              ]
            })
          });
        }),
        p4: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              userTextSources: [
                `次の文章を50語以内で日本語でもっと具体的にして: `,
                `次の文章を50語以内で日本語でもっと悲しくして: `,
                `次の文章を50語以内で日本語でもっと楽しくして: `,
                `次の単語を50語以内で使った詩を日本語で書いて: `,
              ]
            })
          });
        }),

        p5: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({
              userTextSources: [
                `次の文章を50語以内で日本語でもっと具体的にして: `,
                `次の文章を50語以内で日本語でもっと悲しくして: `,
                `次の文章を50語以内で日本語でもっと楽しくして: `,
                `次の単語を50語以内で使った詩を日本語で書いて: `,
                `次の文章の続きを50語以内で日本語で書いて: `
              ]
            })
          });
        })
      }),
    })
  }));
  
  useEffect(() => {
    // TODO: tweaks
    let onWSMessage;
    let onWSopen;

    if (location.search && location.search == '?mode=admin') {
      setAdmin(true);

      onWSMessage = (e) => {
        const { data = '' } = e;
        const d = JSON.parse(data);
        console.log(d);
      };

      onWSopen = (e) => {
        if (socketRef.current) {
          socketRef.current.addEventListener('message', onWSMessage);
        }
      };

      (async () => {
        let rconfig = await fetch('/env');
        rconfig = await rconfig.json();

        const {
          WS_HOST,
          ...rest
        } = rconfig;

        socketRef.current = new WebSocket(`ws:${WS_HOST}:3001`);
        socketRef.current.addEventListener('open', onWSopen);
      })();

    }

    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener('open', onWSopen);
        socketRef.current.removeEventListener('message', onWSMessage);
        socketRef.current.close();
        socketRef.current = false;
      }
    };
  }, []);

  return admin ? (
    <>
      <div
        className="w-full fixed flex flex-col items-start top-0-0 p-4"
        style={{ height: '50vh' }} >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowDragManaged={true}
          rowSelection='multiple'
        /* onRowDragEnd={updateSrcData} */
        />
      </div>
      <Leva />
    </>
  ) : (
    <Leva hidden />
  );
}
