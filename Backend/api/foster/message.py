
import fastapi

router = fastapi.APIRouter()

@router.get("/affirm")
def affirm():
    return {"message": "User removed"}
