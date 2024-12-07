import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/delete")
def delte_cat(id:str):
    cm.forums.delete(id)
    return fastapi.HTTPException(status_code=200,detail="Success")
