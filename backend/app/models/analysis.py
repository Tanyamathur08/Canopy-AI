from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import TimeStampedBase

class AnalysisReport(TimeStampedBase):
    __tablename__ = "analysis_reports"

    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False) # ARCHITECTURE, QUALITY, SECURITY, MAINTAINABILITY
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL, INFO
    description = Column(Text, nullable=False)
    affected_file = Column(String(500), nullable=True)
    line_number = Column(Integer, nullable=True)
    evidence = Column(Text, nullable=True)
    suggested_action = Column(Text, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="analysis_reports")
