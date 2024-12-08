import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/delete")
def delte_post(id:str,title:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    cm.forums.delete(id,title)
    return fastapi.HTTPException(status_code=200,detail="Success")
