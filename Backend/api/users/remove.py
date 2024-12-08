import api.auth.verify_pass as vpass
import api.users.fetch as fetch
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.delete("/remove/{user}")
def remove_user(user:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    fetch.fetch(user,full_match=True)
    cm.users.delete()
    return {"message": "User removed"}
