import uuid
import api.users.fetch as fetch
import fastapi
import utils.configmanager as cm
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.get("/login")
def login(login:str,password:str):
    fetch.fetch(login)
    cm.sessions.set("sessions",)
    return {"sessionid":uuid.uuid4()}
