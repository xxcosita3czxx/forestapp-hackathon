import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.patch("/edit/{user_id}&{title}&{key}&{value}")
def useredit(user_id:str,title:str,key:str,value:str,authorize:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    cm.users.set(user_id,title,key,value)
    return fastapi.HTTPException(status_code=200,detail="Success")