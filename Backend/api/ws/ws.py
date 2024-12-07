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
            # Use the instance to access the get method
            print(data["recipientid"])
            name = cm.users.get(data["recipientid"], "general", "name")
            print(f"Recipient name: {name}")
# todle tu musi bejt nesahej na to
app.include_router(router)
