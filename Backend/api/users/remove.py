import fastapi

router = fastapi.APIRouter()

@router.get("/remove")
def add_user():
    return {"message": "User removed"}
