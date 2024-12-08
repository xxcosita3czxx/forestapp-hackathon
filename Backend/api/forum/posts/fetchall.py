import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall/{cat_id}")
def fetchall_post(cat_id:str,authorize:str=fastapi.Depends(vpass.verify_permission_un)):  # noqa: E501
    return cm.forums.config.get(cat_id)
