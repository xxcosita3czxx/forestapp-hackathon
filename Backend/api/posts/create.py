import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_post(id:str,title:str,description:str,authorization:str=fastapi.Depends(vpass.verify_permission_diez)):  # noqa: E501
    cm.posts.set(id,"general","title",title)
    cm.posts.set(id,"general","description",description)
    return fastapi.HTTPException(status_code=200,detail="Success")
