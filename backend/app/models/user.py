from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import TimeStampedBase

class User(TimeStampedBase):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    preferred_theme = Column(String(20), default="dark", nullable=False)
    preferred_language = Column(String(50), default="python", nullable=True)

    # Relationships
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
