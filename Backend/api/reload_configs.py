import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/reloadconfigs")
def fetchall_post(authorization:str = fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    try:
        cm.users._load_all_configs()
        cm.forums._load_all_configs()
        cm.posts._load_all_configs()
        cm.sessions._load_all_configs()
        return fastapi.HTTPException(status_code=200,detail="Success")
    except Exception:
        return fastapi.HTTPException(status_code=500,detail="Error while reloading, check configs")  # noqa: E501
