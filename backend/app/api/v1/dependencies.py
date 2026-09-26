from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project
from app.schemas.graph import DependencyGraphResponse, ImpactAnalysisResponse
from app.graph.graph_service import graph_service

router = APIRouter(prefix="/projects/{project_id}/dependencies", tags=["Dependencies"])

@router.get("", response_model=DependencyGraphResponse)
def get_dependency_graph(
    project_id: str,
    filter_type: Optional[str] = Query(None, description="Optional node type: file, class, function"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return graph_service.get_dependency_graph(project_id, filter_type=filter_type)

@router.get("/impact", response_model=ImpactAnalysisResponse)
def get_impact_analysis(
    project_id: str,
    symbol: str = Query(..., description="Function, class or file name to analyze"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return graph_service.analyze_impact(project_id, symbol)
