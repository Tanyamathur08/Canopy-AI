from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.models.base import TimeStampedBase

class CodeFile(TimeStampedBase):
    __tablename__ = "code_files"

    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    file_path = Column(String(500), nullable=False, index=True)
    language = Column(String(50), nullable=False)
    file_hash = Column(String(64), nullable=False) # SHA-256
    total_lines = Column(Integer, default=0, nullable=False)
    size_bytes = Column(Integer, default=0, nullable=False)
    indexed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="files")
    symbols = relationship("CodeSymbol", back_populates="file", cascade="all, delete-orphan")

class CodeSymbol(TimeStampedBase):
    __tablename__ = "code_symbols"

    file_id = Column(String(36), ForeignKey("code_files.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    symbol_type = Column(String(50), nullable=False) # CLASS, FUNCTION, METHOD, MODULE
    start_line = Column(Integer, nullable=False)
    end_line = Column(Integer, nullable=False)
    signature = Column(Text, nullable=True)
    docstring = Column(Text, nullable=True)

    # Relationships
    file = relationship("CodeFile", back_populates="symbols")
