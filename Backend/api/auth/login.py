import uuid
from collections import defaultdict
from datetime import datetime, timedelta

import api.users.fetch as fetch
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/login")
def login(login:str,password:str):
    userdata = fetch.search_data(input_value=login,data=defaultdict(dict,cm.users.config),login=True, full_match=True)  # noqa: E501
    sessionid=str(uuid.uuid4())
    userid = userdata["uuid"]
    current_timestamp = datetime.now()
    new_timestamp = current_timestamp + timedelta(minutes=30)
    cm.sessions.set("sessions",userid,"sessionid",sessionid)
    cm.sessions.set("sessions",userid,"valid_until",new_timestamp)
    return {"sessionid":sessionid,"valid_until":new_timestamp,"user_id":userid}
