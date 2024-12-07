import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_cat():
    return 200
