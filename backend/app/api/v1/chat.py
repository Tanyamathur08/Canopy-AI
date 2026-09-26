import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.conversation import Conversation, Message, Citation
from app.schemas.chat import (
    ConversationResponse, MessageResponse, ChatQueryRequest
)
from app.ai.agent import CodebaseAgent

router = APIRouter(prefix="/projects/{project_id}/chat", tags=["AI Chat"])

@router.get("/conversations", response_model=List[ConversationResponse])
def list_conversations(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    convs = db.query(Conversation).filter(
        Conversation.project_id == project_id,
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.desc()).all()
    return convs

@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    conv = Conversation(
        project_id=project_id,
        user_id=current_user.id,
        title="Codebase Investigation"
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    project_id: str,
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.project_id == project_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.post("/conversations/{conversation_id}/query")
def chat_query(
    project_id: str,
    conversation_id: str,
    payload: ChatQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.project_id == project_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Record User Message
    user_msg = Message(
        conversation_id=conv.id,
        role="USER",
        content=payload.message
    )
    db.add(user_msg)
    
    # Auto-title conversation if default
    if conv.title == "Codebase Investigation" and len(payload.message) > 4:
        conv.title = payload.message[:35] + ("..." if len(payload.message) > 35 else "")

    db.commit()

    agent = CodebaseAgent(project_id, db)

    def sse_event_generator():
        collected_tokens = []
        final_citations = []
        final_activities = []

        for event in agent.execute_query_stream(payload.message):
            if event["type"] == "token":
                collected_tokens.append(event["token"])
            elif event["type"] == "complete":
                final_citations = event["citations"]
                final_activities = event["tool_activity"]

            # Send Server-Sent Event
            yield f"data: {json.dumps(event)}\n\n"

        # Persist Assistant Message in Database
        full_text = "".join(collected_tokens)
        assistant_msg = Message(
            conversation_id=conv.id,
            role="ASSISTANT",
            content=full_text,
            tool_activity=final_activities
        )
        db.add(assistant_msg)
        db.flush()

        for c in final_citations:
            db_cit = Citation(
                message_id=assistant_msg.id,
                file_path=c["file_path"],
                start_line=c["start_line"],
                end_line=c["end_line"],
                snippet=c.get("snippet")
            )
            db.add(db_cit)

        db.commit()

    return StreamingResponse(sse_event_generator(), media_type="text/event-stream")
