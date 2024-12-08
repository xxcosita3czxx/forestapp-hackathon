from datetime import datetime

import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_post(id:str,
                post_id:str,
                title:str,
                text:str,
                author_id:str,
                autohorization:str= fastapi.Depends(vpass.verify_permission_dos),
                ):
    if post_id.lower() == "general":
        raise fastapi.HTTPException(status_code=406,detail="Post ID cant be 'general'")  # noqa: E501
    cm.forums.set(id.lower(),post_id.lower(),"title",title)
    cm.forums.set(id.lower(),post_id.lower(),"text",text)
    cm.forums.set(id.lower(),post_id.lower(),"date",datetime.now())
    cm.forums.set(id.lower(),post_id.lower(),"author_id",author_id)
    cm.forums.set(id.lower(),post_id.lower(),"likes","0")
    cm.forums.set(id.lower(),post_id.lower(),"comments","{}")
    return fastapi.HTTPException(status_code=200,detail="Success")
