import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_post(id:str,title:str,text:str):
    cm.forums.set(id,title,"text",text)
    return fastapi.HTTPException(status_code=200,detail="Success")
