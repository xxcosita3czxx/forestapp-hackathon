from collections import defaultdict

import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm

router = fastapi.APIRouter()

def search_data(input_value, data, login=False, full_match=False):  # noqa: C901
    # Search by username (partial match)
    if login is False:
        for _uuid, details in data.items():
            if full_match:
                if details['general']['name'] == input_value:
                    result = {'uuid': _uuid, **details}
                    return result
            else:
                if input_value.lower() in details['general']['name'].lower():
                    result = {'uuid': _uuid, **details}
                    return result

    # Search by email (partial match)
    for _uuid, details in data.items():
        if full_match:
            if details['general']['email'] == input_value:
                result = {'uuid': _uuid, **details}
                return result
        else:
            if input_value.lower() in details['general']['email'].lower():
                result = {'uuid': _uuid, **details}
                return result

    # Search by UUID (exact match)
    if full_match:
        if input_value in data:
            result = {'uuid': input_value, **data[input_value]}
            return result
    else:
        for uuid in data:
            if input_value.lower() in uuid.lower():
                result = {'uuid': uuid, **data[uuid]}
                return result


@router.get("/fetch/{query}")
def fetch(query:str,
        login:bool=False,
        full_match:bool=False,
        authorization:str=fastapi.Depends(vpass.verify_permission_diez),
        ):
    users = cm.users.config
    users_formated = defaultdict(dict,users)
    data = search_data(query,users_formated,login=login,full_match=full_match)
    print (data)
    if data is None or data == "null" or data =="None":
        fastapi.HTTPException(status_code=404,detail="User not found")
    else:
        return data
