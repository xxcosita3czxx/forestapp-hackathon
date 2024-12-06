import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/add")
def add_user(name: str, password: str, timestamp : int):
    try:
        pass
    except Exception:
        return "error"
