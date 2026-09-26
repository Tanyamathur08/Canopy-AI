from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class RepositoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    source_type: str
    remote_url: Optional[str] = None
    default_branch: Optional[str] = "main"
    local_path: str
    commit_hash: Optional[str] = None

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    primary_language: Optional[str] = "python"

class ProjectCreate(ProjectBase):
    source_type: str = "DEMO" # GITHUB, ZIP, DEMO
    github_url: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    primary_language: Optional[str] = None

class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    index_status: str
    file_count: int
    chunk_count: int
    last_indexed_at: Optional[datetime] = None
    created_at: datetime
    repository: Optional[RepositoryResponse] = None
