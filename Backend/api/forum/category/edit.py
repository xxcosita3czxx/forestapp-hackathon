import api.auth.verify_pass as vpass
import fastapi

router = fastapi.APIRouter()

@router.patch("/edit/{id}&{thing}")
def edit_cat(id:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    pass

@router.get("/edit/{id}")
def edit_cat_get(id:str,authorization:str=fastapi.Depends(vpass.verify_permission_un)):  # noqa: E501
    pass
