import fastapi

router = fastapi.APIRouter()

@router.get("/set")
def set_settings():
    return {"message": "Settings set"}