import fastapi

router = fastapi.APIRouter()

@router.get("/fetchall")
def add_user():
    return {"message": "User removed"}
