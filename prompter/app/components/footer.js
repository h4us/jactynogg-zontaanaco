'use client'

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const socketRef = useRef();
  const captionCt = useRef(0);
  const [captions, setCaptions] = useState([]);
  const [captionPos, setCaptionPos] = useState(false);

  useEffect(() => {
    // if (captions.length > 4) {
    //   setTimeout(setCaptions((c) => c.slice(c, c.length - 2)), 3000);
    // }
  }, [captions]);

  useEffect(() => {
    const onWSMessage = (e) => {
      const { data = '' } = e;
      const d = JSON.parse(data);
      // setCaptions((prev) => [`${d[0]} [${captionCt.current}]`, ...prev]);
      setCaptions((prev) => [`${d[0]} [${captionCt.current}]`]);
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
        WS_HOST, TEXT_POSITION,
        ...rest
      } = rconfig;

      setCaptionPos(TEXT_POSITION);
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
    <footer className={captionPos == 'right' ? "w-3/4 fixed flex flex-col items-start right-0 bottom-0 p-4" : "w-3/4 fixed flex flex-col items-start bottom-0 p-4"}>
      {
        captions.map((el, i) => (
          <div key={i} className="inline-flex text-white text-5xl px-2 py-4 my-2 bg-black/[.6]">{el}</div>
        ))
      }
    </footer>
  );
}
