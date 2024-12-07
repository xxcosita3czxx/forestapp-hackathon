import fastapi
from fastapi import HTTPException

router = fastapi.APIRouter()

@router.post("/verify/{sessionid}")
def verify(sessionid:str):
    return HTTPException(status_code=200,detail="Success")
