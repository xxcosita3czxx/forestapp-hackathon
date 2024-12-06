import fastapi

router = fastapi.APIRouter()

@router.get("/fetch/{user_id}")
def add_user():
    return {"message": "User removed"}
