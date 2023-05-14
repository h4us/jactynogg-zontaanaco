#!/usr/bin/env python

import torch
from PIL import Image

from lavis.models import load_model_and_preprocess

from time import sleep
from io import BytesIO
import requests

import asyncio
import websockets
import json

# setup device to use
print(torch.cuda.is_available())
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

async def handler(ws):
    while(True):
        frame = BytesIO(requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot").content)
        raw_image = Image.open(frame).convert("RGB")

        # model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
        model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="large_coco", is_eval=True, device=device)
        image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

        caption = model.generate({"image": image});
        caption_json = json.dumps(caption)
        print(caption_json)

        await ws.send(caption_json)
        await asyncio.sleep(1)

async def main():
    async with websockets.serve(handler, "", 8080):
        await asyncio.Future()

if __name__ == "__main__":
    print('run')
    asyncio.run(main())
