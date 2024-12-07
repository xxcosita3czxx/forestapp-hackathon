import uuid

import fastapi
import utils.configmanager as cm
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.get("/login")
def login():
    
    cm.sessions.set("sessions",)
    return {"sessionid":uuid.uuid4()}
