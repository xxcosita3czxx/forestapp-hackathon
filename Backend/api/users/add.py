import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/add")
def add_user():
    try:
        cm.users.set()
    except Exception:
        return "error"
