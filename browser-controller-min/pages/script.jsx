import { useEffect, useState, useRef, useCallback } from 'react';

import { useRouter } from 'next/router';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

export default function Script() {
  const router = useRouter();
  const [scriptData, setScriptData] = useState('-');
  const scriptRef = useRef();

  const handleUpload = async (presetName = false) => {
    const res = await window.fetch(presetName ? `/tzbot/script?preset=${presetName}` : '/tzbot/script');
    const rjson = await res.json();
    console.log(rjson);
    const { data } = rjson;
    if (data) {
      setScriptData(data);
      scriptRef.current = data;
    }
  };

  const handleDownload = async () => {
    let data = false;

    if (scriptRef.current) {
      data = scriptRef.current;
    }

    if (data) {
      window.fetch('/tzbot/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: data
      });
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
    } catch (err) {
      console.error(err);
    }

    if (fp) {
      const payload = new FormData();
      payload.append('data', fp, 'data.script');
      const res = await window.fetch('/tzbot/script?file=1', {
        method: 'POST',
        body: payload
      });

      const rjson = await res.json();
      const { data = '' } = rjson;
      if (data.length > 0) {
        setScriptData(data);
        scriptRef.current = data;
      }
    }
  };

  const handleCodeChange = (value, viewUpdate) => {
    scriptRef.current = value;
  };

  useEffect(() => {
    const { src } = router.query;

    handleUpload(src);
  }, [router]);

  // useEffect(() => {
  // }, []);

  return (
    <>
      <div className="w-full mt-[9vh] sm:mt-[6vh] p-2" style={{ height: '90vh' }}>
        <nav className='mb-4 flex flex-wrap gap-3'>
          <button
            className="btn btn-primary btn-sm w-full sm:w-auto"
            onClick={handleUpload}>Upload</button>
          <button
            className="btn btn-secondary btn-sm w-full sm:w-auto"
            onClick={handleDownload}>Download</button>
          <button
            className="btn btn-ghost btn-sm w-full sm:w-auto"
            onClick={handleFileOpen}>Load from file</button>
        </nav>

        <CodeMirror
          value={scriptData}
          height="86vh"
          onChange={handleCodeChange}
          extensions={[javascript({ jsx: true }), json()]}
        />

        {/* TODO: */}
        {/* <label>script <input ref={scriptRef} type="file" /></label> */}
      </div>
    </>
  );
}
