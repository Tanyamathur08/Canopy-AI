"""Unit tests for demo codebase authentication and user management."""
import pytest
from app.demo_repo.auth.security import hash_password, verify_password, generate_access_token
from app.demo_repo.services.user_service import UserService

def test_password_hashing():
    password = "secret_password_123"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_user_service_registration():
    service = UserService()
    user = service.register_user("alex@example.com", "mypassword", "Alex Rivera")
    assert user.email == "alex@example.com"
    assert user.full_name == "Alex Rivera"
    assert user.id is not None

def test_user_authentication():
    service = UserService()
    service.register_user("jane@example.com", "pass456", "Jane Doe")
    token = service.authenticate_user("jane@example.com", "pass456")
    assert token is not None
    assert token.startswith("token_")

    invalid = service.authenticate_user("jane@example.com", "wrong")
    assert invalid is None
