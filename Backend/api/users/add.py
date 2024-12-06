import fastapi

router = fastapi.APIRouter()

@router.get("/")
def add_user():
    return {"message": "User added"}
