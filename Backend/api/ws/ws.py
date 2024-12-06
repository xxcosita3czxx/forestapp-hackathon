import fastapi
from fastapi import WebSocket
import json
# Create the FastAPI app
app = fastapi.FastAPI()

# Create routr
router = fastapi.APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
        data = json.loads(data)
        print(data["type"])
# todle tu musi bejt nesahej na to
app.include_router(router)
