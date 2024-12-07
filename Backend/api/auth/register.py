import datetime
import re

import api.users.add as add
import fastapi
from fastapi import HTTPException

app = fastapi.FastAPI()
router = fastapi.APIRouter()

def is_possible_timestamp(ts):
    try:
        timestamp_date = datetime.datetime.fromtimestamp(ts)
        now = datetime.datetime.now()
        hundred_years_ago = now - datetime.timedelta(days=100*365)  # Rough estimate for 100 years  # noqa: E501
        return hundred_years_ago <= timestamp_date <= now
    except (OSError, OverflowError, ValueError):
        return False

def is_valid_username(username):
    allowed_chars = re.compile(r'^[a-zA-Z0-9._]+$')  # Uppercase, lowercase, numbers, dots, underscores  # noqa: E501
    return bool(allowed_chars.match(username))

def is_valid_fullname(username):
    allowed_chars = re.compile(r'^[a-zA-Z]+$')  # Uppercase, lowercase, numbers, dots, underscores  # noqa: E501
    return bool(allowed_chars.match(username))

def is_valid_pass(passw):
    allowed_chars = re.compile(r'^[a-zA-Z0-9._]+$')  # Uppercase, lowercase, numbers, dots, underscores  # noqa: E501
    return bool(allowed_chars.match(passw))

@router.post("/register",responses={406: {"description": "Password requirements wasnt met"},416: {"description": "Timestamp isnt possible to be, check if under or over 100 years"}})  # noqa: E501
def add_user(username: str, password: str, timestamp: int,email: str,first_name: str,last_name: str):  # noqa: E501
    if is_possible_timestamp(timestamp):
        if len(password) < 17 and len(password) > 7 and is_valid_pass(password):  # noqa: PLR2004
            if "@" in email:
                if is_valid_username(username):
                    if is_valid_fullname(first_name) and is_valid_fullname(last_name):  # noqa: E501
                        add.add_user(name=username,password=password,timestamp=timestamp,email=email,first_name=first_name,last_name=last_name)
                        raise HTTPException(status_code=200, detail="Success")
                    else:
                        raise HTTPException(status_code=406,detail="Full name is not valid")  # noqa: E501
                else:
                    raise HTTPException(status_code=406,detail="Username is not valid")  # noqa: E501
            else:
                raise HTTPException(status_code=406,detail="Email is not valid")
        else:
            raise HTTPException(status_code=406, detail="Password must be min 8 max 16")  # noqa: E501
    else:
        timestamp_date = datetime.datetime.fromtimestamp(timestamp)
        now = datetime.datetime.now()
        if now - timestamp_date < 0:
            raise HTTPException(status_code=416, detail="Timestamp under, must be within range.")  # noqa: E501
        elif now - timestamp_date > now:
            raise HTTPException(status_code=416, detail="Timestamp over, must be within range.")  # noqa: E501
        else:
            raise HTTPException(status_code=416, detail="Timestamp Invalid, must be within range.")  # noqa: E501
