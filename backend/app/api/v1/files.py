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
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project or not project.repository:
        raise HTTPException(status_code=404, detail="Project repository not found")

    repo_path = Path(project.repository.local_path).resolve()
    if not repo_path.exists():
        raise HTTPException(status_code=404, detail="Repository path does not exist on disk")

    return build_tree(repo_path, repo_path)

@router.get("/content", response_model=FileContentResponse)
def get_file_content(
    project_id: str,
    path: str = Query(..., description="Relative file path"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project or not project.repository:
        raise HTTPException(status_code=404, detail="Project repository not found")

    repo_path = Path(project.repository.local_path).resolve()
    target_path = (repo_path / path).resolve()

    # Path traversal protection
    if not str(target_path).startswith(str(repo_path)) or not target_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

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
