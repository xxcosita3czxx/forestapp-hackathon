import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/delete")
def delte_post():
    return 200

