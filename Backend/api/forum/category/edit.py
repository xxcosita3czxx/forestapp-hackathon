import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.patch("/edit")
def edit_cat():
    return 200
