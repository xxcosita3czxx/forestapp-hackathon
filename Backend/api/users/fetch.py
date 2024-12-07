import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.get("/fetch/{querry}")
def fetch(user_id:str):
    users = cm.users.config
    
