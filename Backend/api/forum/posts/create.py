from datetime import datetime

import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_post(id:str,
                post_id:str,
                title:str,
                text:str,
                author_id:str):
    cm.forums.set(id,post_id,"title",title)
    cm.forums.set(id,post_id,"text",text)
    cm.forums.set(datetime.now())
    cm.forums.set(id,post_id,"author_id",author_id)
    cm.forums.set(id,post_id,"likes","0")
    cm.forums.set(id,post_id,"comments","{}")
    return fastapi.HTTPException(status_code=200,detail="Success")
