import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/count")
def fetchall_post(id:str,post_id:str):
    return 5