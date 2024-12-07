from collections import defaultdict

import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

def search_data(input_value, data):
    # Search by username
    for _uuid, details in data.items():
        if details['general']['name'] == input_value:
            print(details + "found by name")
            return details
    # Search by email
    for _uuid, details in data.items():
        if details['general']['email'] == input_value:
            print(details+"found by email")
            return details

    # Search by UUID
    if input_value in data:
        print(data[input_value]+"found by uuid")
        return data[input_value]

    return None

@router.get("/fetch/{query}")
def fetch(query:str):
    users = cm.users.config
    users_formated = defaultdict(dict,users)
    data = search_data(query,users_formated)
    if data is None:
        fastapi.HTTPException(status_code=404,detail="User not found")
    else:
        return data
