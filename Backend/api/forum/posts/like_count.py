import api.auth.verify_pass as vpass
import fastapi

router = fastapi.APIRouter()

@router.get("/count/likes/{id}&{post_id}")
def fetchall_post(id:str,post_id:str,authorization:str=fastapi.Depends(vpass.verify_permission_un)):  # noqa: E501
    return 5
