import json
import time

import fastapi
import utils.configmanager as cm
from fastapi import WebSocket
import requests
# Create the FastAPI app
app = fastapi.FastAPI()
router = fastapi.APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        data = json.loads(data)
        if data["type"] == "message":
            data = {"msg":data["content"]}
            contentcheck = requests.post("192.168.0.10", data)
            print(contentcheck)
            contacts = cm.users.get(data["recipientid"], "general", "contacts")
            if cm.users.get(data["recipientid"], "general", "name") is not None and contacts is None:  # noqa: E501
                contacts = data["senderid"]
                cm.users.set(data["recipientid"], "general", "contacts", contacts)
                if data["senderid"] not in contacts:
                    contacts += f",{data["senderid"]}"
                    cm.users.set(data["recipientid"], "general", "contacts", contacts)
            contacts = cm.users.get(data["senderid"], "general", "contacts")
            if cm.users.get(data["senderid"], "general", "name") is not None and contacts is None:  # noqa: E501
                contacts = data["recipientid"]
                cm.users.set(data["senderid"], "general", "contacts", contacts)
            if data["recipientid"] not in contacts:
                contacts += f",{data["recipientid"]}"
                cm.users.set(data["senderid"], "general", "contacts", contacts)
            content = str(data["content"])
            msgs = str(cm.users.get(data["recipientid"], "messages", data["senderid"]))  # noqa: E501
            #print(f"String of msgs: {str(msgs)}")
            try:
                msgs += f",{{\"time\": {time.time()},\"content\":\"{content}\",\"role\":\"recipient\"}}"
            except Exception as e:
                msgs = f",{{\"time\": {time.time()},\"content\":\"{content}\",\"role\":\"recipient\"}}"
                #print(e)
            cm.users.set(data["recipientid"], "messages", data["senderid"], msgs)
            msgs = str(cm.users.get(data["senderid"], "messages", data["recipientid"]))
            #print(msgs)
            content = str(data["content"])
            try:
                msgs += f",{{\"time\": {time.time()},\"content\":\"{content}\",\"role\":\"sender\"}}"
            except Exception as e:
                #print(e)
                msgs = f"{{\"time\": {time.time()},\"content\":\"{content}\",\"role\":\"sender\"}}"
            cm.users.set(data["recipientid"], "messages", data["recipientid"], msgs)
# todle tu musi bejt nesahej na to
app.include_router(router)
