
import fastapi

router = fastapi.APIRouter()

@router.get("/fetch/affirm")
def affirm():
    return {"message": "User removed"}
