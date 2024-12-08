import api.auth.verify_pass as vpass
import fastapi

router = fastapi.APIRouter()

@router.patch("/edit/{id}&{key}&{value}")
def create_post(id:str,key:str,value:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    return fastapi.HTTPException(status_code=200,detail="Success")
