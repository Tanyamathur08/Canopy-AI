from typing import List, Optional
from pydantic import BaseModel

class SemanticSearchRequest(BaseModel):
    query: str
    top_k: int = 8
    file_filter: Optional[str] = None
    language_filter: Optional[str] = None

class ExactSearchRequest(BaseModel):
    query: str
    is_regex: bool = False
    case_sensitive: bool = False
    max_results: int = 50

class SearchResultItem(BaseModel):
    file_path: str
    language: str
    start_line: int
    end_line: int
    symbol_name: Optional[str] = None
    chunk_type: Optional[str] = None
    similarity_score: float
    snippet: str

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResultItem]
