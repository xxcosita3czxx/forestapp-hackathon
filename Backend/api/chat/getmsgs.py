import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()
@router.get("/fetchconvos/{uuid}")
def fetch(uuid:str,login:bool=False,authorize:str=fastapi.Depends(vpass.verify_permission_un)):  # noqa: E501
    users = cm.users.config
    print(users[uuid])
    return users[uuid]["messages"]
