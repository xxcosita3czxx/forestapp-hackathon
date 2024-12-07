import json

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
            if contacts is None:
                contacts = data["senderid"]
                cm.users.set(data["recipientid"], "general", "contacts", contacts)
                cm.users.set(data["recipientid"], "general", data["recipientid"], data["content"])
            if not data["senderid"] in contacts:
                contacts += f",{data["senderid"]}"
                cm.users.set(data["recipientid"], "general", "contacts", contacts)
                cm.users.set(data["recipientid"], "general", data["recipientid"], "")
            contacts = cm.users.get(data["senderid"], "general", "contacts")
            if contacts is None:
                contacts = data["recipientid"]
                cm.users.set(data["senderid"], "general", "contacts", contacts)
                cm.users.set(data["senderid"], "general", data["senderid"], "")
            if not data["recipientid"] in contacts:
                contacts += f",{data["recipientid"]}"
                cm.users.set(data["senderid"], "general", "contacts", contacts)
                cm.users.set(data["senderid"], "general", data["senderid"], "")
            
# todle tu musi bejt nesahej na to
app.include_router(router)
