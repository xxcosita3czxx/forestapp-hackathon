import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

@router.patch("/edit/{id}&{}")
def edit_cat(id:str):
    pass
