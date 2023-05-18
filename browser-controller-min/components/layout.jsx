import { useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';

import { useControls, button, folder, Leva } from 'leva';

import AppMenu from './appmenu';

export default function Layout({ children }) {
  const router = useRouter();

  const [version, setVersion] = useState('');

  const stateRef = useRef(0);
  const callerRef = useRef({});

  const [ctl, setCtl] = useControls(() => ({
    "AGV/Watch": folder({
      State: {
        options: {
          'Off': 0,
          'Basic State': 1,
          'Digital state': 2,
          'Navi state': 3,
          'Landmark history': 4,
          'Task monitor': 5,
          //
          'Custom ': 6
        },
        value: 0,
        onChange: (v) => stateRef.current = v
      },
      Submit: button((v) => {
        window.fetch('/tzbot/state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: stateRef.current
          })
        });
      }),
    }),
    "AGV/Debug": folder({
      mode: {
        options: {
          'Free navi': 0,
          'Map control': 1,
          'Track mode': 2,
        },
        value: 1,
        onChange: (v) => {
          window.fetch('/tzbot/mode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: v
            })
          });
        }
      },
      'Remote call': folder({
        callType: {
          value: 0,
          options: { 'Task': 0, 'Script': 1 },
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
      }),
      'Button Simulate': folder({
        start: button(_ => {
          window.fetch('/tzbot/start');
        }),
        stop: button(_ => {
          window.fetch('/tzbot/stop');
        }),
        reset: button(_ => {
          window.fetch('/tzbot/reset');
        }),
      }),
    })
  }));

  useEffect(() => {
    const { mode } = router.query;

    if (mode && mode == 'preview') {
      document.documentElement.setAttribute('data-theme', 'dracula');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [router]);

  useEffect(() => {
    const onMounted = async () => {
      const res = await window.fetch('/app');
      const { version, appConfig } = await res.json();

      // socketRef.current = new WebSocket(`ws://${location.host}/ws`);
      // socketRef.current.addEventListener('open', function (event) {
      //   socketRef.current.addEventListener('message', function (event) {
      //     let wsdata = {};
      //     wsdata = JSON.parse(event.data);
      //     const { path, data } = wsdata;
      //     console.log(path, data);
      //     setAgvState(JSON.stringify(data).replace(/\},/g, '},\r\n'));
      //   });
      // });

      setVersion(version);
      const { State } = appConfig;
      setCtl({ State });
    };

    onMounted();

    return () => {
      // if (socketRef.current) {
      //   socketRef.current.close();
      //   socketRef.current = null;
      // }
    };
  }, []);

  return (
    <>
      <header className="fixed left-0 top-0 w-full z-10">
        <AppMenu version={version} />
      </header>

      <main>{children}</main>

      <Leva
        /* hidden={ router.route == '/' } */
      />
    </>
  );
}
