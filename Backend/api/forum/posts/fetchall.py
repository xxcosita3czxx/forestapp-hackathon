import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall/{cat_id}")
def fetchall_post(cat_id:str):
    return cm.forums.config.get(cat_id)
