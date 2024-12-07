import fastapi

router = fastapi.APIRouter()

@router.get("/fetch/{user_id}")
def fetch(user_id:str):
    return {"message": f"User {user_id}"}
