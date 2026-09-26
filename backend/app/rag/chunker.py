from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
from app.parsers.base import ParsedFile, ParsedSymbol

@dataclass
class CodeChunk:
    chunk_id: str
    project_id: str
    file_path: str
    language: str
    chunk_type: str # "FUNCTION", "CLASS", "MODULE_HEADER", "BLOCK"
    symbol_name: Optional[str]
    start_line: int
    end_line: int
    content: str
    metadata: Dict[str, Any]

class SemanticCodeChunker:
    @staticmethod
    def chunk_file(project_id: str, parsed: ParsedFile) -> List[CodeChunk]:
        chunks: List[CodeChunk] = []
        lines = parsed.raw_content.splitlines()
        total_lines = len(lines)

        if total_lines == 0:
            return chunks

        # 1. Module Header chunk (imports + file header / module docstrings)
        header_end = min(35, total_lines)
        if parsed.symbols:
            # End header before first symbol
            first_sym_line = min(s.start_line for s in parsed.symbols)
            if first_sym_line > 1:
                header_end = first_sym_line - 1

        if header_end >= 1:
            header_content = "\n".join(lines[:header_end]).strip()
            if header_content:
                chunks.append(CodeChunk(
                    chunk_id=f"{project_id}_{parsed.file_path}_header",
                    project_id=project_id,
                    file_path=parsed.file_path,
                    language=parsed.language,
                    chunk_type="MODULE_HEADER",
                    symbol_name="module_header",
                    start_line=1,
                    end_line=header_end,
                    content=header_content,
                    metadata={
                        "imports": parsed.imports,
                        "file_path": parsed.file_path,
                        "language": parsed.language
                    }
                ))

        # 2. Symbol-level semantic chunks
        for sym in parsed.symbols:
            start = max(1, sym.start_line)
            end = min(total_lines, sym.end_line)
            sym_content = "\n".join(lines[start - 1:end]).strip()

            if sym_content:
                chunks.append(CodeChunk(
                    chunk_id=f"{project_id}_{parsed.file_path}_{sym.name}_{start}_{end}",
                    project_id=project_id,
                    file_path=parsed.file_path,
                    language=parsed.language,
                    chunk_type=sym.symbol_type,
                    symbol_name=sym.name,
                    start_line=start,
                    end_line=end,
                    content=sym_content,
                    metadata={
                        "signature": sym.signature or "",
                        "docstring": sym.docstring or "",
                        "calls": sym.calls,
                        "file_path": parsed.file_path,
                        "language": parsed.language,
                        "symbol_type": sym.symbol_type,
                        "symbol_name": sym.name
                    }
                ))

        # 3. Fallback: If no symbols were found, chunk the file by line windows
        if not chunks:
            window_size = 50
            for i in range(0, total_lines, window_size):
                window_end = min(i + window_size, total_lines)
                block_content = "\n".join(lines[i:window_end]).strip()
                if block_content:
                    chunks.append(CodeChunk(
                        chunk_id=f"{project_id}_{parsed.file_path}_block_{i+1}_{window_end}",
                        project_id=project_id,
                        file_path=parsed.file_path,
                        language=parsed.language,
                        chunk_type="BLOCK",
                        symbol_name=None,
                        start_line=i + 1,
                        end_line=window_end,
                        content=block_content,
                        metadata={
                            "file_path": parsed.file_path,
                            "language": parsed.language,
                            "chunk_type": "BLOCK"
                        }
                    ))

        return chunks
