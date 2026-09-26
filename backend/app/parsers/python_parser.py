import ast
from typing import List, Optional
from app.parsers.base import BaseParser, ParsedFile, ParsedSymbol

class PythonASTParser(BaseParser):
    def parse(self, file_path: str, content: str) -> ParsedFile:
        lines = content.splitlines()
        total_lines = len(lines)
        size_bytes = len(content.encode("utf-8"))

        parsed_file = ParsedFile(
            file_path=file_path,
            language="python",
            total_lines=total_lines,
            size_bytes=size_bytes,
            raw_content=content
        )

        try:
            tree = ast.parse(content)
        except SyntaxError:
            # Fallback if syntax error in incomplete/legacy code
            return parsed_file

        # Extract Imports
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    parsed_file.imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ""
                for alias in node.names:
                    parsed_file.imports.append(f"{module}.{alias.name}" if module else alias.name)

        # Extract Symbols (Classes, Functions, Methods)
        for node in tree.body:
            if isinstance(node, ast.ClassDef):
                cls_symbol = self._parse_class(node)
                parsed_file.symbols.append(cls_symbol)
                # Parse methods inside class
                for item in node.body:
                    if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        method_symbol = self._parse_function(item, symbol_type="METHOD", parent_class=node.name)
                        parsed_file.symbols.append(method_symbol)
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                fn_symbol = self._parse_function(node, symbol_type="FUNCTION")
                parsed_file.symbols.append(fn_symbol)

        return parsed_file

    def _parse_class(self, node: ast.ClassDef) -> ParsedSymbol:
        docstring = ast.get_docstring(node)
        base_names = [ast.unparse(b) for b in node.bases] if hasattr(ast, "unparse") else []
        sig = f"class {node.name}({', '.join(base_names)})" if base_names else f"class {node.name}"
        
        return ParsedSymbol(
            name=node.name,
            symbol_type="CLASS",
            start_line=node.lineno,
            end_line=node.end_lineno or node.lineno,
            signature=sig,
            docstring=docstring
        )

    def _parse_function(self, node: ast.FunctionDef | ast.AsyncFunctionDef, symbol_type: str = "FUNCTION", parent_class: Optional[str] = None) -> ParsedSymbol:
        docstring = ast.get_docstring(node)
        args_str = ""
        if hasattr(ast, "unparse"):
            try:
                args_str = ast.unparse(node.args)
            except Exception:
                args_str = ", ".join(a.arg for a in node.args.args)
        else:
            args_str = ", ".join(a.arg for a in node.args.args)

        is_async = isinstance(node, ast.AsyncFunctionDef)
        prefix = "async def " if is_async else "def "
        full_name = f"{parent_class}.{node.name}" if parent_class else node.name
        sig = f"{prefix}{node.name}({args_str})"

        # Find called function names
        calls: List[str] = []
        for child in ast.walk(node):
            if isinstance(child, ast.Call):
                if isinstance(child.func, ast.Name):
                    calls.append(child.func.id)
                elif isinstance(child.func, ast.Attribute):
                    calls.append(child.func.attr)

        return ParsedSymbol(
            name=full_name,
            symbol_type=symbol_type,
            start_line=node.lineno,
            end_line=node.end_lineno or node.lineno,
            signature=sig,
            docstring=docstring,
            calls=list(set(calls))
        )
