import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/delete")
def delte_post(id:str,title:str):
    cm.forums.delete(id,title)
    return fastapi.HTTPException(status_code=200,detail="Success")
