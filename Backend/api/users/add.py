import base64
import hashlib

import api.auth.verify_pass as vpass
import fastapi
import utils.configmanager as cm
import utils.uuid_gen as ug
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

router = fastapi.APIRouter()

def create_aes_encrypted_code(password, string_to_encrypt="success-uuid"):
    key = hashlib.sha256(password.encode()).digest()
    cipher = AES.new(key, AES.MODE_CBC)
    iv = cipher.iv
    encrypted = cipher.encrypt(pad(string_to_encrypt.encode(), AES.block_size))
    return base64.b64encode(iv + encrypted).decode()

def check_aes_code(password, encrypted_code, original_string="success-uuid"):
    key = hashlib.sha256(password.encode()).digest()
    encrypted_data = base64.b64decode(encrypted_code)
    iv = encrypted_data[:16]
    encrypted = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    try:
        decrypted = unpad(cipher.decrypt(encrypted), AES.block_size).decode()
        return decrypted == original_string
    except Exception as e:  # noqa: F841
        #print(e)
        return False

def create_user(name:str,timestamp:int,password:str,email:str,first_name:str,last_name:str,perm_level:int=1):  # noqa: E501
    new_id = ug.generate_user_id()
    cm.users.set(new_id, "general", "name", name)
    cm.users.set(new_id,"general", "birthday", timestamp)
    enpassword = create_aes_encrypted_code(password,f"success-{new_id}")
    cm.users.set(new_id,"general","pass",str(enpassword))
    cm.users.set(new_id,"general","email",email)
    cm.users.set(new_id,"general","first_name",first_name)
    cm.users.set(new_id,"general","last_name",last_name)
    cm.users.set(new_id,"general","perm_level",perm_level)
    cm.users.set(new_id,"settings","theme","pink")


@router.post("/add")
def add_user(name: str,
            password: str,
            timestamp : int,
            email : str,
            first_name:str,
            last_name:str,
            perm_level:int=1,
            authorization:str=fastapi.Depends(vpass.verify_permission_diez),  # noqa: E501
            ):  # noqa: E501
    create_user(name,timestamp,password,email,first_name,last_name,perm_level)
