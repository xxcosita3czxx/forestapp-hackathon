import json

import fastapi
import utils.configmanager as configmanager
from fastapi import WebSocket

# Create the FastAPI app
app = fastapi.FastAPI()

# Create routr
router = fastapi.APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        data = json.loads(data)
        await websocket.send_text('{"senderid":"' + data["senderid"] + '","content":"' + f"You sent: {data["content"]}\"" + '}')  # noqa: E501
        print(data)
        print(data["type"])
        if data["type"] == "message":
            #configmanager.get(data["recipientid"], "[general]", "name")
            print(data["content"])
# todle tu musi bejt nesahej na to
app.include_router(router)
