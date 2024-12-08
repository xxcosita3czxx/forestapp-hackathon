import api.auth.verify_pass as vpass
import fastapi

router = fastapi.APIRouter()

@router.get("/affirm")
def affirm(authorization:str=fastapi.Depends(vpass.verify_permission_un)):
    return {"message": "Random hlaška"}
