import hmac
import hashlib
import base64
import logging
from datetime import datetime
from django.conf import settings
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

logger = logging.getLogger('accounts')

# --- Key Generation (v2 - HKDF) ---
def generate_user_key_v2(user_id: str) -> bytes:
    """
    Generate v2 encryption key using HKDF (RFC 5869).
    State-of-the-art key derivation.
    """
    try:
        master_secret = settings.ENCRYPTION_MASTER_SECRET.encode('utf-8')
        salt = str(user_id).encode('utf-8')
        info = b'user-data-encryption'

        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            info=info,
        )
        key = hkdf.derive(master_secret)
        return base64.urlsafe_b64encode(key)
    except Exception as e:
        logger.critical(f"HKDF Key Derivation Failed for user {user_id}: {e}")
        raise

# --- Key Generation (v1 - Legacy) ---
def generate_user_key_v1(user_id: str, created_at: datetime) -> bytes:
    """
    Legacy key derivation (SHA256 concatenation).
    Kept for backward compatibility.
    """
    try:
        master_secret = settings.ENCRYPTION_MASTER_SECRET
        created_str = created_at.isoformat() if isinstance(created_at, datetime) else str(created_at)
        
        key_material = f"{str(user_id)}|{created_str}|{master_secret}"
        hash_digest = hashlib.sha256(key_material.encode('utf-8')).digest()
        return base64.urlsafe_b64encode(hash_digest)
    except Exception as e:
        logger.error(f"v1 Key Gen Failed: {e}")
        raise

# --- Public Interface ---

def encrypt_with_user_key(data: str, user_id: str, created_at: datetime = None) -> str:
    """
    Encrypt data using the latest scheme (v2).
    Prepend 'v2$' to the output.
    """
    if not data:
        return data
    
    try:
        key = generate_user_key_v2(user_id)
        cipher = Fernet(key)
        encrypted_bytes = cipher.encrypt(data.encode('utf-8'))
        return f"v2${encrypted_bytes.decode('utf-8')}"
    except Exception as e:
        logger.error(f"Encryption error for user_id {user_id}: {e}", exc_info=True)
        return data

def decrypt_with_user_key(encrypted_data: str, user_id: str, created_at: datetime) -> str:
    """
    Decrypt data handling both v1 (implicit) and v2 (prefixed) formats.
    """
    if not encrypted_data:
        return encrypted_data
    
    try:
        if encrypted_data.startswith('v2$'):
            ciphertext = encrypted_data[3:] # Strip 'v2$'
            key = generate_user_key_v2(user_id)
        else:
            ciphertext = encrypted_data
            if not created_at:
                logger.error(f"Cannot decrypt v1 data for {user_id} without created_at timestamp")
                return encrypted_data
            key = generate_user_key_v1(user_id, created_at)

        cipher = Fernet(key)
        decrypted = cipher.decrypt(ciphertext.encode('utf-8'))
        return decrypted.decode('utf-8')
    except Exception as e:
        logger.warning(f"Decryption failed for user {user_id}: {e}")
        return encrypted_data

def generate_lookup_hash(data: str) -> str:
    if not data: return None
    try:
        hmac_secret = settings.ENCRYPTION_HMAC_SECRET.encode('utf-8')
        normalized_data = str(data).strip().lower().encode('utf-8')
        h = hmac.new(hmac_secret, normalized_data, hashlib.sha256)
        return h.hexdigest()
    except Exception:
        return None

def generate_session_encryption_key(email, signin_timestamp, otp=""):
    try:
        session_secret = settings.ENCRYPTION_SESSION_SECRET
        key_material = f"{email}|{signin_timestamp.isoformat()}|{otp}|{session_secret}"
        hash_digest = hashlib.sha256(key_material.encode('utf-8')).digest()
        return base64.urlsafe_b64encode(hash_digest)
    except:
        return None

def encrypt_session_data(data, email, signin_timestamp, otp=""):
    if not data: return data
    try:
        key = generate_session_encryption_key(email, signin_timestamp, otp)
        cipher = Fernet(key)
        return cipher.encrypt(data.encode('utf-8')).decode('utf-8')
    except:
        return data

def decrypt_session_data(encrypted_data, email, signin_timestamp, otp=""):
    if not encrypted_data: return encrypted_data
    try:
        key = generate_session_encryption_key(email, signin_timestamp, otp)
        cipher = Fernet(key)
        return cipher.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
    except:
        return encrypted_data
