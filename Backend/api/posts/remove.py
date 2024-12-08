import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/remove")
def create_post(id:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    cm.posts.delete(id)
    return fastapi.HTTPException(status_code=200,detail="Success")