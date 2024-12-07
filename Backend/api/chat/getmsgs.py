import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()
@router.get("/fetchconvos/{uuid}")
def fetch(uuid:str,login:bool=False):
    users = cm.users.config
    print(users[uuid])
    return users[uuid]["messages"]
