import fastapi
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.get("/login")
def login():
    return HTTPException(status_code=200,detail="Success")

