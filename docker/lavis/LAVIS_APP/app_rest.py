#!/usr/bin/env python

import os

import torch
from PIL import Image

from io import BytesIO
import requests

from lavis.models import load_model_and_preprocess

from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import ujson

print(torch.cuda.is_available())
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = FastAPI()

@app.get("/")
def rest_endpoint():
    raw_frame = requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot");
    frame = BytesIO(raw_frame.content)
    raw_image = Image.open(frame).convert("RGB")

    model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
    # model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="large_coco", is_eval=True, device=device)
    image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

    caption = model.generate({"image": image});
    return caption

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         await websocket.send_text(message)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             await connection.send_text(message)

# manager = ConnectionManager()

# @app.websocket("/ws/{client_id}")
# async def websocket_endpoint(websocket: WebSocket, client_id: str):
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()

#             raw_frame = requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot");
#             frame = BytesIO(raw_frame.content)
#             raw_image = Image.open(frame).convert("RGB")

#             model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
#             image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

#             caption = model.generate({"image": image});
#             caption_json = ujson.dumps(caption)
#             print(caption_json)

#             await manager.send_personal_message(f"{caption_json}", websocket)
#             await manager.broadcast(f"${caption_json}")
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         await manager.broadcast(f"Client #{client_id} left the chat")
