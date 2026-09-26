import os
import json
import math
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.rag.chunker import CodeChunk
from app.rag.embeddings import embedding_service

class VectorStore:
    def __init__(self):
        self.persist_dir = Path(settings.CHROMA_PERSIST_DIRECTORY)
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        self._collections: Dict[str, List[Dict[str, Any]]] = {}
        self._load_local_data()

    def _get_project_file(self, project_id: str) -> Path:
        return self.persist_dir / f"{project_id}_vectors.json"

    def _load_local_data(self):
        for f in self.persist_dir.glob("*_vectors.json"):
            project_id = f.stem.replace("_vectors", "")
            try:
                with open(f, "r", encoding="utf-8") as fp:
                    self._collections[project_id] = json.load(fp)
            except Exception:
                self._collections[project_id] = []

    def _save_project(self, project_id: str):
        target = self._get_project_file(project_id)
        with open(target, "w", encoding="utf-8") as fp:
            json.dump(self._collections.get(project_id, []), fp)

    def add_chunks(self, project_id: str, chunks: List[CodeChunk]):
        if not chunks:
            return

        if project_id not in self._collections:
            self._collections[project_id] = []

        # Remove existing chunks for the same files (idempotency)
        indexed_files = set(c.file_path for c in chunks)
        self._collections[project_id] = [
            item for item in self._collections[project_id]
            if item.get("file_path") not in indexed_files
        ]

        texts = [f"{c.file_path}\n{c.symbol_name or ''}\n{c.content}" for c in chunks]
        embeddings = embedding_service.get_embeddings(texts)

        for chunk, emb in zip(chunks, embeddings):
            record = {
                "chunk_id": chunk.chunk_id,
                "file_path": chunk.file_path,
                "language": chunk.language,
                "chunk_type": chunk.chunk_type,
                "symbol_name": chunk.symbol_name,
                "start_line": chunk.start_line,
                "end_line": chunk.end_line,
                "content": chunk.content,
                "metadata": chunk.metadata,
                "embedding": emb
            }
            self._collections[project_id].append(record)

        self._save_project(project_id)

    def search(
        self,
        project_id: str,
        query: str,
        top_k: int = 5,
        file_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        items = self._collections.get(project_id, [])
        if not items:
            return []

        query_emb = embedding_service.get_embeddings([query])[0]
        results = []

        query_tokens = set(query.lower().split())

        for doc in items:
            if file_filter and file_filter not in doc["file_path"]:
                continue

            # Cosine similarity on dense embedding
            doc_emb = doc.get("embedding", [])
            cosine_sim = self._cosine_similarity(query_emb, doc_emb)

            # Lexical BM25 / token match boost
            doc_text = f"{doc['file_path']} {doc.get('symbol_name') or ''} {doc['content']}".lower()
            token_hits = sum(1 for t in query_tokens if t in doc_text)
            lexical_boost = (token_hits / max(1, len(query_tokens))) * 0.3

            score = cosine_sim * 0.7 + lexical_boost

            results.append({
                "chunk_id": doc["chunk_id"],
                "file_path": doc["file_path"],
                "language": doc["language"],
                "chunk_type": doc["chunk_type"],
                "symbol_name": doc["symbol_name"],
                "start_line": doc["start_line"],
                "end_line": doc["end_line"],
                "snippet": doc["content"],
                "similarity_score": min(0.99, max(0.1, score))
            })

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        if not v1 or not v2 or len(v1) != len(v2):
            return 0.0
        dot = sum(a * b for a, b in zip(v1, v2))
        return (dot + 1.0) / 2.0 # Scale to [0, 1]

    def delete_project(self, project_id: str):
        if project_id in self._collections:
            del self._collections[project_id]
        target = self._get_project_file(project_id)
        if target.exists():
            target.unlink()

vector_store = VectorStore()
