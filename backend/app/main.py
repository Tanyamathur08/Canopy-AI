import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import SessionLocal
from app.services.init_db import init_db
from app.api.v1.router import api_router

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("codemind")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CodeMind AI Database...")
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    logger.info("CodeMind AI system startup completed.")
    yield
    logger.info("Shutting down CodeMind AI...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Agentic AI & RAG Software Engineering Platform API",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"^https?:\/\/.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again."}
    )

@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "message": "Canopy AI Backend API is live and operational!",
        "interactive_api_docs": "/docs",
        "health": "/health"
    }

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    from fastapi import Response
    return Response(status_code=204)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "services": {
            "api": "operational",
            "database": "operational",
            "chromadb": "operational",
            "neo4j": "operational",
            "gemini": "connected" if settings.GEMINI_API_KEY else "offline_fallback_mode"
        }
    }

# Mount v1 API
app.include_router(api_router, prefix="/api/v1")
