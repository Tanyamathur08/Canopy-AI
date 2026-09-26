from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    preferred_theme: str = "dark"
    preferred_language: Optional[str] = "python"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_theme: Optional[str] = None
    preferred_language: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    created_at: datetime
