import os
import uuid


def generate_user_id():
    not_unique = True
    while not_unique:
        new_uuid = str(uuid.uuid4())  # Generate a unique UUID and convert to string
        if os.path.exists(f"data/users/{new_uuid}.toml"):
            continue
        else:
            return new_uuid
