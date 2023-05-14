FROM pytorch/pytorch:latest

RUN apt update
RUN apt install -y build-essential

RUN pip install fastapi[all] websockets salesforce-lavis

WORKDIR /opt/LAVIS_APP
