import uuid
from collections import defaultdict
from datetime import datetime

import api.users.add as add
import api.users.fetch as fetch
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/login")
def login(login:str,password:str):
    userdata = fetch.search_data(input_value=login,data=defaultdict(dict,cm.users.config),login=True, full_match=True)  # noqa: E501
    if userdata is None:
        raise fastapi.HTTPException(status_code=404,detail="User not found")
    sessionid=str(uuid.uuid4())
    userid = userdata["uuid"]
    current_timestamp =  int(datetime.timestamp(datetime.now()))
    new_timestamp = current_timestamp + 1800
    if not add.check_aes_code(password,cm.users.get(userid,"general","pass"),f"success-{userid}"):  # noqa: E501
        return fastapi.HTTPException(status_code=403,detail="Wrong User or Password")  # noqa: E501
    cm.sessions.set("sessions",userid,"sessionid",sessionid)
    cm.sessions.set("sessions",userid,"valid_until",new_timestamp)
    return fastapi.responses.JSONResponse({"sessionid":sessionid,"valid_until":str(new_timestamp),"user_id":userid})  # noqa: E501
