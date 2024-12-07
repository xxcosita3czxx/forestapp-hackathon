import base64
import hashlib

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
    except Exception:
        return False


@router.post("/add")
def add_user(name: str, password: str, timestamp : int, email : str):
    try:
        new_id = ug.generate_user_id()
        cm.users.set(new_id, "general", "name", name)
        cm.users.set(new_id,"general", "birthday", timestamp)
        enpassword = create_aes_encrypted_code(password,f"success-{new_id}")
        cm.users.set(new_id,"general","pass",str(enpassword))
        cm.users.set(new_id,"general","email",email)
    except Exception:
        return "error"
