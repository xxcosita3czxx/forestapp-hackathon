import fastapi

router = fastapi.APIRouter()

@router.get("/")
def set_settings():
    return {"message": "Settings set"}