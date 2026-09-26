from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class AnalysisReportItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    category: str # ARCHITECTURE, QUALITY, SECURITY, MAINTAINABILITY
    title: str
    severity: str # LOW, MEDIUM, HIGH, CRITICAL, INFO
    description: str
    affected_file: Optional[str] = None
    line_number: Optional[int] = None
    evidence: Optional[str] = None
    suggested_action: str
    created_at: datetime

class ArchitectureSummary(BaseModel):
    primary_language: str
    detected_patterns: List[str]
    core_modules: List[str]
    entrypoints: List[str]

class CodebaseAnalysisResponse(BaseModel):
    project_id: str
    summary: ArchitectureSummary
    total_issues: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    items: List[AnalysisReportItem]
