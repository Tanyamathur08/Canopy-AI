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
