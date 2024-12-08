import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.patch("/set/{user_id}&{title}&{setting}&{key}")
def patch(user_id:str,title:str,setting:str,key:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    settings = cm.users.set(user_id,title,setting,key)
    return settings

@router.get("/set/{user_id}")
def get(user_id:str,authorization:str=fastapi.Depends(vpass.verify_permission_un)):
    settings = cm.users.config.get(user_id)
    return settings
