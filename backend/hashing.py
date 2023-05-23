import hashlib
import os
import base64

class Hash():
    @staticmethod
    def bcrypt(password: str):
        salt = base64.b64encode(os.urandom(16)).decode('utf-8')
        hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return f'{salt}${base64.b64encode(hashed).decode("utf-8")}'

    @staticmethod
    def verify(hashed, normal):
        print(hashed, normal)
        salt, saved_hash = hashed.split('$')
        salt = salt.encode('utf-8')
        saved_hash = base64.b64decode(saved_hash)
        new_hash = hashlib.pbkdf2_hmac('sha256', normal.encode('utf-8'), salt, 100000)
        return saved_hash == new_hash