import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetchall")
def fetchall(authorize:str=fastapi.Depends(vpass.verify_permission_un)):
    return cm.users.config
