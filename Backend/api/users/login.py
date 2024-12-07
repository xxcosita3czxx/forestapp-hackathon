import uuid

import api.users.fetch as fetch
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/login")
def login(login:str,password:str):
    userdata = fetch.fetch(login)
    sessionid=str(uuid.uuid4())
    print(userdata)
    userid = userdata["uuid"]
    print(userid)
    cm.sessions.set("sessions",userid,"sessionid",sessionid)
    return {"sessionid":sessionid,"valid_until":}
