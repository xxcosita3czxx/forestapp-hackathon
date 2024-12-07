import fastapi
import random
router = fastapi.APIRouter()

@router.get("/fetch/affirm")
def affirm():
    return {"message": "User removed"}
