import hashlib
import json
import random
import secrets
import string

def generate_session_id(length=256):
    characters = string.ascii_letters + string.digits + string.punctuation
    session_id = ''.join(secrets.choice(characters) for _ in range(length))
    return session_id

def generate_sha256_hash(data):
    sha256_hash = hashlib.sha256(data.encode()).hexdigest()
    return sha256_hash