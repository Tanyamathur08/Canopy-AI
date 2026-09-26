"""User domain service handling registration, credentials, and profile operations."""
from typing import Optional, List, Dict
import uuid
from app.demo_repo.auth.security import hash_password, verify_password, generate_access_token
from app.demo_repo.models.user import UserEntity

class UserService:
    def __init__(self):
        self._users: Dict[str, UserEntity] = {}

    def register_user(self, email: str, plain_password: str, full_name: str) -> UserEntity:
        """Registers a new user with hashed password."""
        if email in [u.email for u in self._users.values()]:
            raise ValueError(f"User with email {email} already registered.")
        
        user_id = str(uuid.uuid4())
        hashed = hash_password(plain_password)
        new_user = UserEntity(
            id=user_id,
            email=email,
            hashed_password=hashed,
            full_name=full_name
        )
        self._users[user_id] = new_user
        return new_user

    def authenticate_user(self, email: str, plain_password: str) -> Optional[str]:
        """Validates credentials and returns an access token if valid."""
        for user in self._users.values():
            if user.email == email and verify_password(plain_password, user.hashed_password):
                return generate_access_token(user.id, user.email)
        return None

    def get_by_id(self, user_id: str) -> Optional[UserEntity]:
        """Retrieves a user by unique identifier."""
        return self._users.get(user_id)
