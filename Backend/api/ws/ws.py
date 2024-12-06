import fastapi
from fastapi import WebSocket

# Create the FastAPI app
app = fastapi.FastAPI()

# Create routr
router = fastapi.APIRouter()
def extract(name, i):
    out = ""
    if name in i:
        i = i.replace(name,"")
        for y in i:
            if y != "\"":
                out += y
    return out
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
                data = data.replace("[message]", "")
                lsdata = data.split(",")
                for i in lsdata:
                    if "conent" in i:
                        content = extract("content:", i)
                    if "recipientid" in i:
                        recipientid = extract("recipientid:", i)
                    if "senderid" in i:
                        senderid = extract("senderid:", i)
                print(content)
                print(recipientid)
                print(senderid)
        else:
            await websocket.send_text("Malformed request")
# todle tu musi bejt nesahej na to
app.include_router(router)
