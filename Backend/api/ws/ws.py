import json
import time
import fastapi
import utils.configmanager as cm
from fastapi import WebSocket

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
            contacts = cm.users.get(data["recipientid"], "general", "contacts")
            if cm.users.get(data["recipientid"], "general", "name") is not None and contacts is None:
                contacts = data["senderid"]
                cm.users.set(data["recipientid"], "general", "contacts", contacts)
                if data["senderid"] not in contacts:
                    contacts += f",{data["senderid"]}"
                    cm.users.set(data["recipientid"], "general", "contacts", contacts)
            contacts = cm.users.get(data["senderid"], "general", "contacts")
            if cm.users.get(data["senderid"], "general", "name") is not None and contacts is None:
                contacts = data["recipientid"]
                cm.users.set(data["senderid"], "general", "contacts", contacts)
            if data["recipientid"] not in contacts:
                contacts += f",{data["recipientid"]}"
                cm.users.set(data["senderid"], "general", "contacts", contacts)
            msgs = cm.users.get(data["recipientid"], "general", data["senderid"])
            msgs = json.loads(msgs)
            msgs["Messages"].append(json.loads({
                "time": time.time(),
                "content": data["content"],
                "role":"recipient",
            }))
            cm.usres.set(data["recipientid"], "general")
                
            
# todle tu musi bejt nesahej na to
app.include_router(router)
