import os
import base64
from cryptography.fernet import Fernet
from django.conf import settings

def get_encryption_key():
    key = os.environ.get('ENCRYPTION_KEY')
    if not key:
        key = base64.urlsafe_b64encode(os.urandom(32)).decode()
    return key

# Initialize Cipher lazily if needed, but for models we'll just use the key directly or Fernet(settings.ENCRYPTION_KEY)
def get_cipher():
    return Fernet(settings.ENCRYPTION_KEY.encode())

def encrypt_data(data: str) -> str:
    if not data:
        return data
    try:
        cipher = get_cipher()
        if isinstance(data, str):
            data_bytes = data.encode('utf-8')
        else:
            data_bytes = data
        encrypted = cipher.encrypt(data_bytes)
        return encrypted.decode('utf-8')
    except Exception as e:
        print(f"Encryption error: {e}")
        return data

def decrypt_data(data: str) -> str:
    if not data:
        return data
    try:
        cipher = get_cipher()
        if isinstance(data, str):
            data_bytes = data.encode('utf-8')
        else:
            data_bytes = data
        decrypted = cipher.decrypt(data_bytes)
        return decrypted.decode('utf-8')
    except Exception as e:
        return data

def get_currency_for_country(country_name):
    if not country_name:
        return 'USD'
    country_name = country_name.lower().strip()
    if country_name in ['india', 'in', 'ind', 'bharat']:
        return 'INR'
    return 'USD'
