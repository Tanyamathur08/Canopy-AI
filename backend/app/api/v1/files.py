import os
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.file import CodeFile, CodeSymbol
from app.schemas.file import FileTreeNode, FileContentResponse, SymbolResponse

router = APIRouter(prefix="/projects/{project_id}/files", tags=["Files"])

def build_tree(base_path: Path, current_path: Path) -> FileTreeNode:
    is_dir = current_path.is_dir()
    rel = current_path.relative_to(base_path).as_posix()
    name = current_path.name

    if not is_dir:
        ext = current_path.suffix.lstrip(".")
        size = current_path.stat().st_size
        return FileTreeNode(
            name=name,
            path=rel,
            type="file",
            size=size,
            language=ext
        )
    
    children = []
    ignored = {".git", "__pycache__", "node_modules", "venv", ".venv"}
    for child in sorted(current_path.iterdir(), key=lambda p: (p.is_file(), p.name.lower())):
        if child.name not in ignored:
            children.append(build_tree(base_path, child))

    return FileTreeNode(
        name=name or "root",
        path=rel if rel != "." else "",
        type="directory",
        children=children
    )

@router.get("/tree", response_model=FileTreeNode)
def get_file_tree(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.repository:
        raise HTTPException(status_code=404, detail="Project repository not found")

    repo_path = Path(project.repository.local_path).resolve()
    if not repo_path.exists():
        from app.services.repository_service import RepositoryService
        try:
            RepositoryService.load_demo_repository(project, db)
            repo_path = Path(project.repository.local_path).resolve()
        except Exception:
            pass

    if not repo_path.exists():
        return FileTreeNode(name=project.name, path="", type="directory", children=[])

    return build_tree(repo_path, repo_path)

@router.get("/content", response_model=FileContentResponse)
def get_file_content(
    project_id: str,
    path: str = Query(..., description="Relative file path"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.repository:
        raise HTTPException(status_code=404, detail="Project repository not found")

    repo_path = Path(project.repository.local_path).resolve()
    if not repo_path.exists():
        from app.services.repository_service import RepositoryService
        try:
            RepositoryService.load_demo_repository(project, db)
            repo_path = Path(project.repository.local_path).resolve()
        except Exception:
            pass

    # Normalize relative path: remove leading slashes and convert Windows backslashes
    clean_path = path.lstrip("/\\").replace("\\", "/")
    target_path = (repo_path / clean_path).resolve()

    # If direct relative path doesn't exist, attempt fallback by file name inside repo
    if not target_path.exists():
        file_name = Path(clean_path).name
        candidates = [c for c in repo_path.rglob(file_name) if c.is_file()]
        if candidates:
            target_path = candidates[0].resolve()

    # Path traversal protection
    try:
        target_path.relative_to(repo_path)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid path traversal")

    if not target_path.exists() or not target_path.is_file():
        raise HTTPException(status_code=404, detail=f"File '{clean_path}' not found")

    content = target_path.read_text(encoding="utf-8", errors="replace")
    ext = target_path.suffix.lstrip(".")

    # Fetch symbols from DB if available
    db_file = db.query(CodeFile).filter(CodeFile.project_id == project_id, CodeFile.file_path == path).first()
    symbols = []
    if db_file:
        symbols = [
            SymbolResponse(
                id=s.id,
                name=s.name,
                symbol_type=s.symbol_type,
                start_line=s.start_line,
                end_line=s.end_line,
                signature=s.signature,
                docstring=s.docstring
            ) for s in db_file.symbols
        ]

    return FileContentResponse(
        file_path=path,
        language=ext or "text",
        total_lines=len(content.splitlines()),
        size_bytes=len(content.encode("utf-8")),
        content=content,
        symbols=symbols
    )
