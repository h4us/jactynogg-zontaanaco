'use client'

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const socketRef = useRef();
  const captionCt = useRef(0);
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    if (captions.length > 4) {
      setTimeout(setCaptions((c) => c.slice(c, c.length - 2)), 3000);
    }
  }, [captions]);

  useEffect(() => {
    const onWSMessage = (e) => {
      const { data = '' } = e;
      const d = JSON.parse(data);
      setCaptions((prev) => [`${d[0]} [${captionCt.current}]`, ...prev]);
      captionCt.current ++;
    };

    const onWSopen = (e) => {
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

    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener('open', onWSopen);
        socketRef.current.removeEventListener('message', onWSMessage);
        socketRef.current.close();
        socketRef.current = false;
      }
    };
  }, []);

  return (
    <footer className="w-full fixed flex flex-col items-center bottom-0 text-center p-4">
      {
        captions.map((el, i) => (
          <div key={i} className="inline-flex text-white text-6xl px-2 py-4 my-2 bg-black/[.6]">{el}</div>
        ))
      }
    </footer>
  );
}
