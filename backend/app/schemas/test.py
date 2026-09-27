from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class TestGenerateRequest(BaseModel):
    file_path: str
    target_symbol: Optional[str] = None # class or function name
    framework: str = "pytest"

class TestGenerateResponse(BaseModel):
    file_path: str
    target_symbol: Optional[str] = None
    generated_test_code: str
    explanation: str

class TestRunRequest(BaseModel):
    test_path: Optional[str] = None
    custom_code: Optional[str] = None

class TestRunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str # PASSED, FAILED, ERROR
    total_tests: int
    passed_count: int
    failed_count: int
    skipped_count: int
    duration_sec: float
    output_log: str
    failure_description: Optional[str] = None
    suggested_solution: Optional[str] = None
    suggested_code: Optional[str] = None
    test_suite_name: Optional[str] = None
    created_at: datetime
