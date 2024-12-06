import fastapi

router = fastapi.APIRouter()

@router.get("/fetch/{user_id}")
def affirm():
    return {"message": "User removed"}
