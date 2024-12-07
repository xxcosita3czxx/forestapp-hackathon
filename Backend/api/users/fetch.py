from collections import defaultdict

import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

def search_data(input_value, data, login=False,full_match=False):
    # Search by username (partial match)
    if login is False:
        for _uuid, details in data.items():
            if full_match:
                if details['general']['name'] == input_value:
                    return details
            else:
                if input_value.lower() in details['general']['name'].lower():
                    return details

    # Search by email (partial match)
    for _uuid, details in data.items():
        if full_match:
            if details['general']['email'] == input_value:
                return details
        else:
            if input_value.lower() in details['general']['email'].lower():
                return details

    # Search by UUID (exact match)
    if full_match:
        if input_value in data:
            return data[input_value]
    else:
        for uuid in data:
            if input_value.lower() in uuid.lower():
                return data[uuid]

    return "No match found."


@router.get("/fetch/{query}")
def fetch(query:str,login:bool=False,full_match:bool=False):
    users = cm.users.config
    users_formated = defaultdict(dict,users)
    data = search_data(query,users_formated,login=login,full_match=full_match)
    if data is None:
        fastapi.HTTPException(status_code=404,detail="User not found")
    else:
        return data
