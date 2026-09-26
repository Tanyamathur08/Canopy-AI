import logging
from sqlalchemy.orm import Session
from app.core.database import Base, engine
from app.core.security import hash_password
from app.models.user import User

logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Check if demo user exists
    demo_user = db.query(User).filter(User.email == "demo@codemind.ai").first()
    if not demo_user:
        logger.info("Creating initial demo user: demo@codemind.ai")
        demo_user = User(
            email="demo@codemind.ai",
            hashed_password=hash_password("password123"),
            full_name="Alex Rivera",
            preferred_theme="dark",
            preferred_language="python",
            is_active=True,
            is_superuser=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        logger.info("Demo user initialized successfully.")

    # Ensure demo user has an indexed reference project
    from app.models.project import Project
    from app.services.repository_service import RepositoryService
    from app.services.indexing_service import IndexingService

    demo_proj = db.query(Project).filter(Project.user_id == demo_user.id).first()
    if not demo_proj:
        logger.info("Seeding and indexing Demo Microservice for demo user...")
        demo_proj = Project(
            name="Demo Microservice",
            description="Enterprise authentication, user entities, and payment processing microservice",
            user_id=demo_user.id,
            primary_language="python",
            index_status="PENDING"
        )
        db.add(demo_proj)
        db.commit()
        db.refresh(demo_proj)
        RepositoryService.load_demo_repository(demo_proj, db)
        IndexingService.index_project(demo_proj.id, db)
        logger.info(f"Demo Microservice indexed with ID: {demo_proj.id}")
