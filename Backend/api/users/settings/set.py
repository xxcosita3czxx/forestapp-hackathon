import fastapi

router = fastapi.APIRouter()

@router.post("/set")
def set_settings():
    return {"message": "Settings set"}
