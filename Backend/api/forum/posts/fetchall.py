import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall")
def fetchall_post():
    return cm.forums.config
