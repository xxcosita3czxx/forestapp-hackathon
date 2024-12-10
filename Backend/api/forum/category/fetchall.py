import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall")
def fetchall_cat(authorization:str=fastapi.Depends(vpass.verify_permission_un)):
    try:
        return cm.forums.config
    except Exception as e:
        return fastapi.HTTPException(status_code=500,detail=e)
