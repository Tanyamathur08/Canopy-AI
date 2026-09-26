from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class FileTreeNode(BaseModel):
    name: str
    path: str
    type: str # "file" or "directory"
    size: Optional[int] = None
    language: Optional[str] = None
    children: Optional[List["FileTreeNode"]] = None

class SymbolResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    symbol_type: str # CLASS, FUNCTION, METHOD, MODULE
    start_line: int
    end_line: int
    signature: Optional[str] = None
    docstring: Optional[str] = None

class FileContentResponse(BaseModel):
    file_path: str
    language: str
    total_lines: int
    size_bytes: int
    content: str
    symbols: List[SymbolResponse] = []
