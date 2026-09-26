from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class ParsedSymbol:
    name: str
    symbol_type: str # "CLASS", "FUNCTION", "METHOD", "MODULE"
    start_line: int
    end_line: int
    signature: Optional[str] = None
    docstring: Optional[str] = None
    calls: List[str] = field(default_factory=list)

@dataclass
class ParsedFile:
    file_path: str
    language: str
    total_lines: int
    size_bytes: int
    imports: List[str] = field(default_factory=list)
    symbols: List[ParsedSymbol] = field(default_factory=list)
    raw_content: str = ""

class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_path: str, content: str) -> ParsedFile:
        pass
