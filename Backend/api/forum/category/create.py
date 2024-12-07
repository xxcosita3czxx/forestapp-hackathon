import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_cat(id:str,title:str,desc:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    cm.forums.set(id.lower(),"general","title",title)
    cm.forums.set(id.lower(),"general","description",desc)
    return fastapi.HTTPException(status_code=200,detail="Success")
