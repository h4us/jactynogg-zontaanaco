'use client'

import { useEffect, useRef, useState, useMemo } from "react";

import { useControls, button, toggle, folder, Leva } from 'leva';

export default function Preference() {
  const socketRef = useRef();
  const [admin, setAdmin] = useState(false);

  const qListRef = useRef(new Set());
  const customIntervalRef = useRef('');
  const customQuestionRef = useRef('');

  const getParentPath = (path) => {
    return path.split('.').pop();
  };

  const sendQlist = (v, l) => {
    const k = getParentPath(l);

    if (v) {
      qListRef.current.add(k);
    } else {
      qListRef.current.delete(k);
    }

    window.fetch('/config', {
      method: 'post',
      body: JSON.stringify({
        userTextSources: Array.from(qListRef.current)
      })
    });
  };

  const sendCustomInterval = () => {
    let jsonv = false;
    try {
      jsonv = JSON.parse(`[${customIntervalRef.current}]`);
    } catch (err) {
      console.error(err);
    }

    try {
      const [mode, ...rest] = jsonv;
      if (
        (mode == 'random' || mode == 'sample') &&
        (rest.findIndex((el) => typeof el !== 'number') == -1) &&
        rest.length > 1
      ) {
        window.fetch('/config', {
          method: 'post',
          body: JSON.stringify({ rqInterval: [mode, ...rest] })
        });
      } else {
        console.error('Validation error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendCustomQuestion = () => {
    let jsonv = false;

    try {
      jsonv = JSON.parse(`[${customQuestionRef.current}]`);
    } catch (err) {
      console.error(err);
    }

    try {
      if (
        Array.isArray(jsonv) &&
        (jsonv.findIndex((el) => typeof el !== 'string') == -1)
      ) {
        window.fetch('/config', {
          method: 'post',
          body: JSON.stringify({
            userTextSources: jsonv
          })
        });
      } else {
        console.error('Validation error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ctl = useControls(() => ({
    "Preference": folder({
      //
      'Abort': folder({
        abort: button(_ => { window.fetch('/abort'); }),
      }),
      'Interval': folder({
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
        custom: {
          value: '',
          onChange: (v) => {
            customIntervalRef.current = v;
          }
        },
        'send custom intervals': button(sendCustomInterval),
      }),
      //
      'Questions': folder({
        '次の文章を50語以内で日本語でもっと具体的にして: ' : {
          value: false,
          onChange: sendQlist
        },
        '次の文章を50語以内で日本語でもっと悲しくして: ' : {
          value: false,
          onChange: sendQlist
        },
        '次の文章を50語以内で日本語でもっと楽しくして: ' : {
          value: false,
          onChange: sendQlist
        },
        '次の文章の続きを50語以内で日本語で書いて: ' : {
          value: false,
          onChange: sendQlist
        },
        '文中の名詞を日本語に変換してリストにしてください。英語は除外してください: ' : {
          value: true,
          onChange: sendQlist
        },
        'custom question': {
          value: '',
          onChange: (v) => {
            customQuestionRef.current = v;
          }
        },
        'send custom question': button(sendCustomQuestion),
      }),
      'LAVIS': folder({
        m_default: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ lavisEndpoint: 'default' })
          });
        }),
        m0: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ lavisEndpoint: 'm0' })
          });
        }),
        m1: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ lavisEndpoint: 'm1' })
          });
        }),
        m2: button(_ => {
          window.fetch('/config', {
            method: 'post',
            body: JSON.stringify({ lavisEndpoint: 'm2' })
          });
        }),
      })
    })
  }));

  useEffect(() => {
    // TODO: tweaks
    let onWSMessage;
    let onWSopen;
    let autoReload;

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
    } else {
      // TODO:
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener('open', onWSopen);
        socketRef.current.removeEventListener('message', onWSMessage);
        socketRef.current.close();
        socketRef.current = false;
      }

      if (autoReload) {
        clearInterval(autoReload);
      }
    };
  }, []);

  return admin ? (
    <Leva />
  ) : (
    <Leva hidden />
  );
}
