'use client'

import { useEffect, useRef, useState } from "react";

export default function Mjpeg() {
  const [mjpegHost, setMjpegHost] = useState([]);

  useEffect(() => {
    (async () => {
      let rconfig = await fetch('/env');
      rconfig = await rconfig.json();

      const {
        MJPEG_STREAMER_HOST = ''
      } = rconfig;

      setMjpegHost(MJPEG_STREAMER_HOST);
    })();
  }, []);

  return (
    <figure className="w-full aspect-[16/9]">
      <img
    src={`http://${mjpegHost}:8081/stream`}
        className="w-full object-contain" />
    </figure>
  );
}
