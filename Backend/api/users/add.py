import fastapi

router = fastapi.APIRouter()

@router.get("/add")
def add_user():
    return {"message": "User added"}
