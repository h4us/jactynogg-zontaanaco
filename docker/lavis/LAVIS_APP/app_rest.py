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

    caption = model.generate({"image": image}, use_nucleus_sampling=True);
    return caption

@app.get("/default")
def rest_endpoint_default():
    print('/default')
    raw_frame = requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot");
    frame = BytesIO(raw_frame.content)
    raw_image = Image.open(frame).convert("RGB")

    model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
    # model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="large_coco", is_eval=True, device=device)
    image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

    caption = model.generate({"image": image}, use_nucleus_sampling=True);
    return caption

@app.get("/m0")
def rest_endpoint_m0():
    print('/m0')
    raw_frame = requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot");
    frame = BytesIO(raw_frame.content)
    raw_image = Image.open(frame).convert("RGB")

    model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
    # model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="large_coco", is_eval=True, device=device)
    image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

    caption = model.generate({"image": image});
    return caption

@app.get("/m1")
def rest_endpoint_m1():
    print('/m1')
    raw_frame = requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot");
    frame = BytesIO(raw_frame.content)
    raw_image = Image.open(frame).convert("RGB")

    model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
    # model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="large_coco", is_eval=True, device=device)
    image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

    caption = model.generate({"image": image}, use_nucleus_sampling=True, top_p=0.85);
    return caption

@app.get("/m2")
def rest_endpoint_m2():
    print('/m2')
    raw_frame = requests.get(f"http://{os.environ['MJPEG_STREAMER_HOST']}:8081/snapshot");
    frame = BytesIO(raw_frame.content)
    raw_image = Image.open(frame).convert("RGB")

    model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=device)
    # model, vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="large_coco", is_eval=True, device=device)
    image = vis_processors["eval"](raw_image).unsqueeze(0).to(device)

    caption = model.generate({"image": image}, use_nucleus_sampling=True, top_p=0.975);
    return caption
