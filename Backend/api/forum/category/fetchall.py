import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall")
def fetchall_cat():
    return cm.forums.config
