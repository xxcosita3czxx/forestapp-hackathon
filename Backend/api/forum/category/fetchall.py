import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall")
def fetchall_cat(id:str,title:str,desc:str):
    return cm.forums.config
