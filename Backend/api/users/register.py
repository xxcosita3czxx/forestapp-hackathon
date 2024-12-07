import datetime

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

@router.post("/register",responses={406: {"description": "Password requirements wasnt met"},416: {"description": "Timestamp isnt possible to be, check if under or over 100 years"}})  # noqa: E501
def add_user(name: str, password: str, timestamp : int):
    if is_possible_timestamp(timestamp):
        if password > 16 and password < 7:  # noqa: PLR2004
            add.add_user(name=name,password=password,timestamp=timestamp)
        else:
            raise HTTPException(status_code=406, detail="Password must be min 8 max 16")  # noqa: E501
    else:
        timestamp_date = datetime.datetime.fromtimestamp(ts)
        now = datetime.datetime.now()
        if now - timestamp_date < 0:
            raise HTTPException(status_code=416, detail="Timestamp under, must be within range.")  # noqa: E501
        elif now - timestamp_date > now:
            raise HTTPException(status_code=416, detail="Timestamp over, must be within range.")  # noqa: E501
        else:
            raise HTTPException(status_code=416, detail="Timestamp Invalid, must be within range.")  # noqa: E501
