import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.patch("/set/{setting}")
def set_settings(setting:str=fastapi.Depends(None)):
    settings = cm.sessions.config.get("default_settings")
    return settings
