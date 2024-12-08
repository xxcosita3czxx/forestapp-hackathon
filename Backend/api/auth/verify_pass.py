import json
from datetime import datetime

import fastapi
import utils.configmanager as cm
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()


def bearer_token(credentials: HTTPAuthorizationCredentials = fastapi.Depends(security)):  # noqa: B008, E501
    try:
        # Ensure the scheme is Bearer
        if credentials.scheme != "Bearer":
            raise HTTPException(status_code=401, detail="Invalid Authorization scheme")  # noqa: E501

        # Parse the JSON-like token
        try:
            token_data = json.loads(credentials.credentials)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Malformed Bearer token - Not JSON")  # noqa: B904, E501

        # Extract required fields
        sessionid = token_data.get("sessionid")
        valid_until = token_data.get("valid_until")
        user_id = token_data.get("user_id")

        # Ensure all required fields are present
        if not all([sessionid, valid_until, user_id]):
            raise HTTPException(status_code=400, detail="Malformed Bearer token - Missing fields")  # noqa: E501raise fastapi.HTTPException(status_code=200,detail="Success")

        # Validate expiration
        valid_until_dt = datetime.fromisoformat(valid_until)
        if datetime.utcnow() > valid_until_dt:
            raise HTTPException(status_code=401, detail="Token has expired")

        return user_id, sessionid

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Error processing token: {str(e)}")  # noqa: B904, E501

def verify_permission_un(session: str = fastapi.Depends(bearer_token)):  # noqa: E501
    user_id, sessionid = session
    perm_level = cm.users.get(user_id,"general","perm_level",default=1)
    sessionid_saved = cm.sessions.get("sessions",user_id,"sessionid")
    if sessionid == sessionid_saved:
        if perm_level >= 1:
            return True
        else:
            raise fastapi.HTTPException(status_code=403,detail="Unauthorized")
    else:
        raise fastapi.HTTPException(status_code=401,detail="Please log in again")

def verify_permission_dos(session: str = fastapi.Depends(bearer_token)):  # noqa: E501
    user_id, sessionid = session
    perm_level = cm.users.get(user_id,"general","perm_level")
    sessionid_saved = cm.sessions.get("sessions",user_id,"sessionid")
    if sessionid == sessionid_saved:
        if perm_level >= 2:  # noqa: PLR2004
            return True
        else:
            raise fastapi.HTTPException(status_code=403,detail="Unauthorized")
    else:
        raise fastapi.HTTPException(status_code=401,detail="Please log in again")

def verify_permission_diez(session: str = fastapi.Depends(bearer_token)):  # noqa: E501
    user_id, sessionid = session
    perm_level = cm.users.get(user_id,"general","perm_level")
    sessionid_saved = cm.sessions.get("sessions",user_id,"sessionid")
    if sessionid == sessionid_saved:
        if perm_level >= 10:  # noqa: PLR2004
            return True
        else:
            raise fastapi.HTTPException(status_code=403,detail="Unauthorized")
    else:
        raise fastapi.HTTPException(status_code=401,detail="Please log in again")
