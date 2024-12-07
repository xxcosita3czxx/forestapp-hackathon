import fastapi
import utils.configmanager as cm
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()

rq_level = 1

def bearer_token(authorization: HTTPAuthorizationCredentials = fastapi.Depends(security)):  # noqa: B008, E501
    # Ensure the header starts with "Bearer"
    print(authorization)
    if not str(authorization).startswith("Bearer "):
        raise fastapi.HTTPException(status_code=401, detail="Invalid Authorization header format")  # noqa: E501

    # Extract the token (after "Bearer ")
    token = authorization.split(" ")[1]

    # Extract userid and sessionid
    userid = token.get("userid")
    sessionid = token.get("sessionid")

    # Validate userid and sessionid presence
    if not userid or not sessionid:
        raise fastapi.HTTPException(status_code=400, detail="Malformed token")

    return userid, sessionid

def verify_permission(session: str = fastapi.Depends(bearer_token)):  # noqa: E501
    print(rq_level)
    user_id, sessionid = session
    perm_level = cm.users.get(user_id,"general","perm_level")
    sessionid_saved = cm.sessions.get("sessions",user_id,"sessionid")
    if sessionid == sessionid_saved:
        if perm_level >= rq_level:
            return fastapi.HTTPException(status_code=200,detail="Success")
        else:
            return fastapi.HTTPException(status_code=403,detail="Unauthorized")
    else:
        return fastapi.HTTPException(status_code=401,detail="Please log in again")

# Dynamically set the required permission level for routes
def set_permission_level(level: int):
    global rq_level
    rq_level = level
