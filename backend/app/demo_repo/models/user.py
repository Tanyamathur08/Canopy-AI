"""User data model and entity definitions."""
from dataclasses import dataclass
from typing import Optional

@dataclass
class UserEntity:
    id: str
    email: str
    hashed_password: str
    full_name: str
    is_active: bool = True
    role: str = "developer"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active
        }
