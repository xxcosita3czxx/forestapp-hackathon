import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall")
def create_post(authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    return cm.posts.config
