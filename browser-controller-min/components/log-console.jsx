import React, { useState, useEffect, useRef } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

const LogConsole = () => {
  const [logData, setLogData] = useState('');
  const [theme, setTheme] = useState(0);

  const socketRef = useRef();

  useEffect(() => {
    let t = false;

    const onMounted = async () => {
      socketRef.current = new WebSocket(`ws://${location.host}/ws`);

      socketRef.current.addEventListener('open', function (event) {
        if (logData.length == 0) {
          t = setInterval(() => {
            socketRef.current.send(JSON.stringify({ path: '/xstate', data: 1 }));
          }, 1000);
        }

        socketRef.current.addEventListener('message', function (event) {
          let wsdata = {};
          wsdata = JSON.parse(event.data);
          const { path, data } = wsdata;

          // console.log(path, data);

          if (path == '/state/xstate') {
            const [current, history] = data;
            setLogData(JSON.stringify(current, null, 2));
            if (t) {
              clearInterval(t);
              t = false;
            }
          }

          if (path == '/state/writing') { setTheme(data); }
        });
      });
    };

    // onMounted();

    return () => {
      if (t) { clearInterval(t); }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <CodeMirror
      value={logData}
      readOnly={true}
      theme={theme == 0 ? githubLight : githubDark}
      extensions={[json()]}
    />
  );
};

export { LogConsole }
