import random

import api.auth.verify_pass as vpass
import fastapi

router = fastapi.APIRouter()

@router.get("/affirm")
def affirm(authorization:str=fastapi.Depends(vpass.verify_permission_un)):
    affirms = list(open(r"Backend\api\foster\output.txt", encoding='utf-8'))  # noqa: SIM115
    return {"message": random.choice(affirms)}  # noqa: S311
