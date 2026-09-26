from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict

class CitationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    file_path: str
    start_line: int
    end_line: int
    snippet: Optional[str] = None

class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str
    tool_activity: Optional[List[str]] = None
    created_at: datetime
    citations: List[CitationResponse] = []

class ConversationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

class ChatQueryRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    stream: bool = True

class StreamEvent(BaseModel):
    event_type: str # "activity", "token", "citation", "complete", "error"
    data: Any
