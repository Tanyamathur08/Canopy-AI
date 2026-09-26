from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str # Display label
    node_type: str # "file", "class", "function", "module"
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str # "IMPORTS", "CALLS", "DEFINES", "DEPENDS_ON", "CONTAINS"

class DependencyGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class ImpactAnalysisResponse(BaseModel):
    target_node: str
    impacted_nodes: List[GraphNode]
    upstream_callers: List[str]
    downstream_dependencies: List[str]
    risk_level: str # "LOW", "MEDIUM", "HIGH"
