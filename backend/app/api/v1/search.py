from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project
from app.schemas.search import SemanticSearchRequest, ExactSearchRequest, SearchResponse, SearchResultItem
from app.rag.vector_store import vector_store
from app.ai.agent import CodebaseAgent

router = APIRouter(prefix="/projects/{project_id}/search", tags=["Search"])

@router.post("/semantic", response_model=SearchResponse)
def semantic_search(
    project_id: str,
    payload: SemanticSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    raw_results = vector_store.search(
        project_id=project_id,
        query=payload.query,
        top_k=payload.top_k,
        file_filter=payload.file_filter
    )

    items = [
        SearchResultItem(
            file_path=r["file_path"],
            language=r["language"],
            start_line=r["start_line"],
            end_line=r["end_line"],
            symbol_name=r.get("symbol_name"),
            chunk_type=r.get("chunk_type"),
            similarity_score=round(r["similarity_score"], 3),
            snippet=r["snippet"]
        ) for r in raw_results
    ]

    return SearchResponse(
        query=payload.query,
        total_results=len(items),
        results=items
    )

@router.post("/exact", response_model=SearchResponse)
def exact_search(
    project_id: str,
    payload: ExactSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    agent = CodebaseAgent(project_id, db)
    raw = agent.exact_code_search(payload.query)

    items = [
        SearchResultItem(
            file_path=r["file_path"],
            language="text",
            start_line=r["start_line"],
            end_line=r["end_line"],
            symbol_name=None,
            chunk_type="LINE",
            similarity_score=1.0,
            snippet=r["snippet"]
        ) for r in raw
    ]

    return SearchResponse(
        query=payload.query,
        total_results=len(items),
        results=items
    )
