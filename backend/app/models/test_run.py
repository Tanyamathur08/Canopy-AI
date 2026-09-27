from sqlalchemy import Column, String, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import TimeStampedBase

class TestRun(TimeStampedBase):
    __tablename__ = "test_runs"

    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    test_suite_name = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False) # PASSED, FAILED, ERROR
    total_tests = Column(Integer, default=0, nullable=False)
    passed_count = Column(Integer, default=0, nullable=False)
    failed_count = Column(Integer, default=0, nullable=False)
    skipped_count = Column(Integer, default=0, nullable=False)
    duration_sec = Column(Float, default=0.0, nullable=False)
    output_log = Column(Text, nullable=True)
    failure_description = Column(Text, nullable=True)
    suggested_solution = Column(Text, nullable=True)
    suggested_code = Column(Text, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="test_runs")
