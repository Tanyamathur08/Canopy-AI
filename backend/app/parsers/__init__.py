import os
from app.parsers.base import BaseParser, ParsedFile, ParsedSymbol
from app.parsers.python_parser import PythonASTParser
from app.parsers.generic_parser import GenericCodeParser

def get_parser_for_file(file_path: str) -> BaseParser:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".py":
        return PythonASTParser()
    elif ext in [".js", ".jsx"]:
        return GenericCodeParser(language="javascript")
    elif ext in [".ts", ".tsx"]:
        return GenericCodeParser(language="typescript")
    elif ext in [".java"]:
        return GenericCodeParser(language="java")
    else:
        return GenericCodeParser(language="text")

__all__ = ["BaseParser", "ParsedFile", "ParsedSymbol", "PythonASTParser", "GenericCodeParser", "get_parser_for_file"]
