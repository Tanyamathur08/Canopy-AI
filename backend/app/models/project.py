from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import TimeStampedBase

class Project(TimeStampedBase):
    __tablename__ = "projects"

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    primary_language = Column(String(50), nullable=True)
    index_status = Column(String(50), default="PENDING", nullable=False) # PENDING, INDEXING, COMPLETED, FAILED
    file_count = Column(Integer, default=0, nullable=False)
    chunk_count = Column(Integer, default=0, nullable=False)
    last_indexed_at = Column(DateTime, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="projects")
    repository = relationship("Repository", back_populates="project", uselist=False, cascade="all, delete-orphan")
    files = relationship("CodeFile", back_populates="project", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="project", cascade="all, delete-orphan")
    analysis_reports = relationship("AnalysisReport", back_populates="project", cascade="all, delete-orphan")
    test_runs = relationship("TestRun", back_populates="project", cascade="all, delete-orphan")

class Repository(TimeStampedBase):
    __tablename__ = "repositories"

    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)
    source_type = Column(String(50), nullable=False) # GITHUB, ZIP, DEMO
    remote_url = Column(String(500), nullable=True)
    default_branch = Column(String(100), default="main", nullable=True)
    local_path = Column(String(500), nullable=False)
    commit_hash = Column(String(100), nullable=True)

    # Relationships
    project = relationship("Project", back_populates="repository")
