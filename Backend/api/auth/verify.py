import fastapi
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.get("/verify")
def verify():
    return HTTPException(status_code=200,detail="Success")
