import re
from typing import List
from app.parsers.base import BaseParser, ParsedFile, ParsedSymbol

class GenericCodeParser(BaseParser):
    def __init__(self, language: str = "generic"):
        self.language = language

    def parse(self, file_path: str, content: str) -> ParsedFile:
        lines = content.splitlines()
        total_lines = len(lines)
        size_bytes = len(content.encode("utf-8"))

        parsed_file = ParsedFile(
            file_path=file_path,
            language=self.language,
            total_lines=total_lines,
            size_bytes=size_bytes,
            raw_content=content
        )

        # Regex patterns for JS/TS/Java/Go
        func_pattern = re.compile(r'(?:function\s+([a-zA-Z0-9_$]+)|(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|def\s+([a-zA-Z0-9_$]+)|public\s+[a-zA-Z0-9_<>]+\s+([a-zA-Z0-9_$]+)\s*\()')
        class_pattern = re.compile(r'class\s+([a-zA-Z0-9_$]+)')
        import_pattern = re.compile(r'(?:import\s+(?:.*?from\s+)?["\'](.*?)["\']|require\(["\'](.*?)["\']\))')

        for i, line in enumerate(lines, start=1):
            # Imports
            imp_match = import_pattern.search(line)
            if imp_match:
                imp_name = imp_match.group(1) or imp_match.group(2)
                if imp_name:
                    parsed_file.imports.append(imp_name)

            # Classes
            cls_match = class_pattern.search(line)
            if cls_match:
                name = cls_match.group(1)
                parsed_file.symbols.append(ParsedSymbol(
                    name=name,
                    symbol_type="CLASS",
                    start_line=i,
                    end_line=min(i + 30, total_lines),
                    signature=line.strip()
                ))
                continue

            # Functions
            fn_match = func_pattern.search(line)
            if fn_match:
                name = next(g for g in fn_match.groups() if g is not None)
                parsed_file.symbols.append(ParsedSymbol(
                    name=name,
                    symbol_type="FUNCTION",
                    start_line=i,
                    end_line=min(i + 20, total_lines),
                    signature=line.strip()
                ))

        return parsed_file
