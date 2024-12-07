import fastapi
import utils.configmanager as cm
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.post("/verify/{sessionid}&{userid}")
def verify(sessionid:str, userid:str):
    sessionid_saved = cm.sessions.get("sessions",userid,sessionid)
    valid_until = cm.sessions.get("sessions",userid,"valid_until")
    if valid_until
    return HTTPException(status_code=200,detail="Success")
