import api.users.fetch as fetch
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/remove/{user}")
def remove_user(user:str):
    fetch.fetch(user,full_match=True)
    cm.users.delete()
    return {"message": "User removed"}
