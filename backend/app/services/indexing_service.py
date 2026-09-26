import os
import hashlib
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any, Callable, Optional
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.file import CodeFile, CodeSymbol
from app.parsers import get_parser_for_file
from app.parsers.base import ParsedFile
from app.rag.chunker import SemanticCodeChunker, CodeChunk
from app.rag.vector_store import vector_store
from app.graph.graph_service import graph_service

IGNORED_DIRS = {
    ".git", "__pycache__", "node_modules", "venv", ".venv", "env",
    "dist", "build", "coverage", ".idea", ".vscode", ".next", ".turbo"
}

IGNORED_EXTENSIONS = {
    ".pyc", ".pyo", ".pyd", ".png", ".jpg", ".jpeg", ".gif", ".svg",
    ".ico", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".zip", ".tar",
    ".gz", ".exe", ".dll", ".so", ".dylib", ".db", ".sqlite", ".bin"
}

class IndexingService:
    @classmethod
    def index_project(
        cls,
        project_id: str,
        db: Session,
        progress_callback: Optional[Callable[[str, int, int], None]] = None
    ) -> Dict[str, Any]:
        """Performs full end-to-end AST parsing, semantic chunking, vector indexing, and knowledge graph mapping."""
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project or not project.repository:
            raise ValueError(f"Project {project_id} or associated repository not found.")

        project.index_status = "INDEXING"
        db.commit()

        root_path = Path(project.repository.local_path).resolve()
        discovered_files: List[Path] = []

        # 1. File Discovery
        for root, dirs, files in os.walk(root_path):
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            for file_name in files:
                ext = os.path.splitext(file_name)[1].lower()
                if ext not in IGNORED_EXTENSIONS:
                    discovered_files.append(Path(root) / file_name)

        total_files = len(discovered_files)
        parsed_files: List[ParsedFile] = []
        all_chunks: List[CodeChunk] = []

        # Clear existing DB files and symbols for idempotency
        db.query(CodeFile).filter(CodeFile.project_id == project_id).delete()
        db.commit()

        # 2. Parsing & Chunking Loop
        for i, file_path in enumerate(discovered_files, start=1):
            rel_path = file_path.relative_to(root_path).as_posix()
            try:
                content = file_path.read_text(encoding="utf-8", errors="replace")
            except Exception:
                continue

            file_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
            parser = get_parser_for_file(rel_path)
            parsed = parser.parse(rel_path, content)
            parsed_files.append(parsed)

            # Store CodeFile record
            db_file = CodeFile(
                project_id=project_id,
                file_path=rel_path,
                language=parsed.language,
                file_hash=file_hash,
                total_lines=parsed.total_lines,
                size_bytes=parsed.size_bytes
            )
            db.add(db_file)
            db.flush()

            # Store CodeSymbol records
            for sym in parsed.symbols:
                db_sym = CodeSymbol(
                    file_id=db_file.id,
                    name=sym.name,
                    symbol_type=sym.symbol_type,
                    start_line=sym.start_line,
                    end_line=sym.end_line,
                    signature=sym.signature,
                    docstring=sym.docstring
                )
                db.add(db_sym)

            # Semantic chunking
            chunks = SemanticCodeChunker.chunk_file(project_id, parsed)
            all_chunks.extend(chunks)

            if progress_callback:
                progress_callback("parsing", i, total_files)

        # 3. Vector Store Ingestion (ChromaDB / Embeddings)
        vector_store.add_chunks(project_id, all_chunks)

        # 4. Knowledge Graph Ingestion (Neo4j / Property Graph)
        graph_service.populate_from_parsed_files(project_id, parsed_files)

        # 5. Finalize Project Stats
        project.index_status = "COMPLETED"
        project.file_count = total_files
        project.chunk_count = len(all_chunks)
        project.last_indexed_at = datetime.now(timezone.utc)
        db.commit()

        return {
            "status": "COMPLETED",
            "files_indexed": total_files,
            "chunks_generated": len(all_chunks),
            "symbols_extracted": sum(len(pf.symbols) for pf in parsed_files)
        }
