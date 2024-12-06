import os

from database import db, test
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Custom environment works!"}

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    import uvicorn
    uvicorn.run("app:app", host=host, port=port, reload=debug)
