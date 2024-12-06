import fastapi
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
        await websocket.send_text(f"Message text was: {data}")
        if "\"" in data:
            if "[message]" in data:
                content = ""
                recipientid = ""
                senderid = ""
                
        else:
            await websocket.send_text("Malformed request")
# todle tu musi bejt nesahej na to
app.include_router(router)
