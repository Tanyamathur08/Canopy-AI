import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.parsers.base import ParsedFile
from app.schemas.graph import GraphNode, GraphEdge, DependencyGraphResponse, ImpactAnalysisResponse

logger = logging.getLogger(__name__)

class KnowledgeGraphService:
    def __init__(self):
        self._graph_store: Dict[str, Dict[str, Any]] = {}

    def populate_from_parsed_files(self, project_id: str, parsed_files: List[ParsedFile]):
        """Populates the knowledge graph with files, classes, functions, and import/call relationships."""
        nodes: Dict[str, GraphNode] = {}
        edges: List[GraphEdge] = []

        # 1. Create File and Symbol Nodes
        for pf in parsed_files:
            file_id = f"file_{pf.file_path}"
            nodes[file_id] = GraphNode(
                id=file_id,
                label=pf.file_path.split("/")[-1],
                node_type="file",
                properties={"path": pf.file_path, "language": pf.language, "lines": pf.total_lines}
            )

            # Symbols
            for sym in pf.symbols:
                sym_id = f"{sym.symbol_type.lower()}_{pf.file_path}_{sym.name}"
                nodes[sym_id] = GraphNode(
                    id=sym_id,
                    label=sym.name,
                    node_type=sym.symbol_type.lower(),
                    properties={
                        "name": sym.name,
                        "file": pf.file_path,
                        "start_line": sym.start_line,
                        "end_line": sym.end_line,
                        "signature": sym.signature or ""
                    }
                )
                # Edge: File CONTAINS Symbol
                edges.append(GraphEdge(
                    id=f"contains_{file_id}_{sym_id}",
                    source=file_id,
                    target=sym_id,
                    label="CONTAINS"
                ))

        # 2. Create Dependency Edges (IMPORTS)
        for pf in parsed_files:
            file_id = f"file_{pf.file_path}"
            for imp in pf.imports:
                # Find matching target file
                for other_pf in parsed_files:
                    if other_pf.file_path != pf.file_path and (
                        imp in other_pf.file_path.replace("/", ".").replace("\\", ".") or
                        other_pf.file_path.endswith(f"{imp}.py") or
                        other_pf.file_path.endswith(f"{imp}.ts")
                    ):
                        other_id = f"file_{other_pf.file_path}"
                        edge_id = f"imports_{file_id}_{other_id}"
                        edges.append(GraphEdge(
                            id=edge_id,
                            source=file_id,
                            target=other_id,
                            label="IMPORTS"
                        ))

            # Calls
            for sym in pf.symbols:
                sym_id = f"{sym.symbol_type.lower()}_{pf.file_path}_{sym.name}"
                for called_name in sym.calls:
                    # Match with other functions/methods
                    for other_pf in parsed_files:
                        for other_sym in other_pf.symbols:
                            if other_sym.name.endswith(called_name) and other_sym.name != sym.name:
                                target_id = f"{other_sym.symbol_type.lower()}_{other_pf.file_path}_{other_sym.name}"
                                if target_id in nodes:
                                    edges.append(GraphEdge(
                                        id=f"calls_{sym_id}_{target_id}",
                                        source=sym_id,
                                        target=target_id,
                                        label="CALLS"
                                    ))

        self._graph_store[project_id] = {
            "nodes": list(nodes.values()),
            "edges": edges
        }
        logger.info(f"Graph indexed for {project_id}: {len(nodes)} nodes, {len(edges)} edges.")

    def get_dependency_graph(self, project_id: str, filter_type: Optional[str] = None) -> DependencyGraphResponse:
        data = self._graph_store.get(project_id, {"nodes": [], "edges": []})
        nodes = data["nodes"]
        edges = data["edges"]

        if filter_type:
            nodes = [n for n in nodes if n.node_type == filter_type]
            node_ids = set(n.id for n in nodes)
            edges = [e for e in edges if e.source in node_ids and e.target in node_ids]

        return DependencyGraphResponse(nodes=nodes, edges=edges)

    def analyze_impact(self, project_id: str, symbol_name: str) -> ImpactAnalysisResponse:
        data = self._graph_store.get(project_id, {"nodes": [], "edges": []})
        nodes = data["nodes"]
        edges = data["edges"]

        target_node = next((n for n in nodes if symbol_name.lower() in n.label.lower()), None)
        if not target_node:
            return ImpactAnalysisResponse(
                target_node=symbol_name,
                impacted_nodes=[],
                upstream_callers=[],
                downstream_dependencies=[],
                risk_level="LOW"
            )

        # Trace upstream callers (who points to target_node)
        upstream = [e.source for e in edges if e.target == target_node.id]
        # Trace downstream (who target_node points to)
        downstream = [e.target for e in edges if e.source == target_node.id]

        impacted_ids = set(upstream + downstream)
        impacted_nodes = [n for n in nodes if n.id in impacted_ids]

        risk = "HIGH" if len(upstream) > 3 else ("MEDIUM" if len(upstream) > 0 else "LOW")

        return ImpactAnalysisResponse(
            target_node=target_node.label,
            impacted_nodes=impacted_nodes,
            upstream_callers=[n.label for n in nodes if n.id in upstream],
            downstream_dependencies=[n.label for n in nodes if n.id in downstream],
            risk_level=risk
        )

graph_service = KnowledgeGraphService()
