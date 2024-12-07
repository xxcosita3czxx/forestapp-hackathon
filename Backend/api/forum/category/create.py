import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.post("/create")
def create_cat(id:str,title:str,desc:str):
    cm.forums.set(id,"general","title",title)
    cm.forums.set(id,"general","description",desc)
    return fastapi.HTTPException(status_code=200,detail="Success")
