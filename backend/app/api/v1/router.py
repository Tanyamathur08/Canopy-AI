from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as projects_router
from app.api.v1.files import router as files_router
from app.api.v1.search import router as search_router
from app.api.v1.chat import router as chat_router
from app.api.v1.dependencies import router as dependencies_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.tests import router as tests_router
from app.api.v1.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(files_router)
api_router.include_router(search_router)
api_router.include_router(chat_router)
api_router.include_router(dependencies_router)
api_router.include_router(analysis_router)
api_router.include_router(tests_router)
api_router.include_router(analytics_router)
