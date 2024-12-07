from datetime import datetime, timedelta

import fastapi
import utils.configmanager as cm
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.post("/verify/{sessionid}&{userid}")
def verify(sessionid:str, userid:str):
    sessionid_saved = cm.sessions.get("sessions",userid,sessionid)
    valid_until = cm.sessions.get("sessions",userid,"valid_until")
    current_timestamp = datetime.now()
    if sessionid_saved == sessionid:
        if current_timestamp - valid_until > 0:
            new_timestamp = current_timestamp + timedelta(minutes=30)
            cm.sessions.set("sessions",userid,"valid_until",new_timestamp)
            return HTTPException(status_code=200,detail="Success")
        else:
            return HTTPException(status_code=401,detail="User was logged out")
