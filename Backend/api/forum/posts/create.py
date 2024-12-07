import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_post(id:str,title:str,text:str,author_id:str):
    cm.forums.set(id,title,"text",text)
    cm.forums.set(id,title,"author_id",author_id)
    return fastapi.HTTPException(status_code=200,detail="Success")
