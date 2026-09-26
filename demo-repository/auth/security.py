"""Authentication and cryptographic security utilities."""
import os
import hashlib
import hmac
from datetime import datetime, timedelta, timezone

SECRET_KEY = os.getenv("SECRET_KEY", "demo-insecure-secret-key-12345")
ALGORITHM = "HS256"
TOKEN_EXPIRY_MINUTES = 60

def hash_password(password: str) -> str:
    """Hashes a password with salt using PBKDF2."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100_000)
    return f"{salt.hex()}:{key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored salt:hash string."""
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        key = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 100_000)
        return hmac.compare_digest(key, expected_key)
    except Exception:
        return False

def generate_access_token(user_id: str, email: str) -> str:
    """Generates an authentication access token payload."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRY_MINUTES)
    token_data = {
        "sub": user_id,
        "email": email,
        "exp": expire.timestamp(),
        "iat": datetime.now(timezone.utc).timestamp()
    }
    # In production, signed via PyJWT
    return f"token_{user_id}_{int(expire.timestamp())}"
