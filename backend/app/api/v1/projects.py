from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project, Repository
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.repository_service import RepositoryService
from app.services.indexing_service import IndexingService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(Project).filter(
        (Project.user_id == current_user.id) | (Project.name.contains("Demo"))
    ).order_by(Project.created_at.desc()).all()
    if not projects:
        projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects

@router.post("", response_model=ProjectResponse)
def create_project(
    data: ProjectCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        name=data.name,
        description=data.description,
        user_id=current_user.id,
        primary_language=data.primary_language or "python",
        index_status="PENDING"
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Ingest based on source type
    if data.source_type == "DEMO":
        RepositoryService.load_demo_repository(project, db)
        # Trigger background indexing
        IndexingService.index_project(project.id, db)
    elif data.source_type == "GITHUB" and data.github_url:
        RepositoryService.clone_github_repository(project, data.github_url, db=db)
        IndexingService.index_project(project.id, db)

    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if data.name:
        project.name = data.name
    if data.description is not None:
        project.description = data.description
    if data.primary_language:
        project.primary_language = data.primary_language
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"status": "success", "message": f"Project {project_id} deleted"}

@router.post("/{project_id}/upload")
async def upload_zip_repository(
    project_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    content = await file.read()
    RepositoryService.extract_zip_codebase(project, content, db)
    # Trigger indexing immediately
    stats = IndexingService.index_project(project.id, db)
    db.refresh(project)
    return {"status": "success", "indexing_stats": stats, "project": project}

@router.post("/{project_id}/reindex")
def reindex_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    stats = IndexingService.index_project(project.id, db)
    return {"status": "success", "indexing_stats": stats}
