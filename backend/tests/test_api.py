import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine, SessionLocal
from app.services.init_db import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    init_db(db)
    db.close()
    yield

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data

def test_auth_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@codemind.ai", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_auth_me_with_token():
    # Login to get token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@codemind.ai", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    
    # Get profile
    resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200
    user_data = resp.json()
    assert user_data["email"] == "demo@codemind.ai"
    assert user_data["full_name"] == "Alex Rivera"

def test_demo_project_creation_and_indexing():
    # Login to get token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@codemind.ai", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create demo project
    proj_resp = client.post(
        "/api/v1/projects",
        json={
            "name": "Demo E-Commerce Microservice",
            "description": "Production microservice demo repository",
            "source_type": "DEMO"
        },
        headers=headers
    )
    assert proj_resp.status_code == 200
    project = proj_resp.json()
    project_id = project["id"]
    assert project["index_status"] == "COMPLETED"
    assert project["file_count"] > 0

    # Test file tree retrieval
    tree_resp = client.get(f"/api/v1/projects/{project_id}/files/tree", headers=headers)
    assert tree_resp.status_code == 200
    tree = tree_resp.json()
    assert len(tree["children"]) > 0

    # Test semantic search
    search_resp = client.post(
        f"/api/v1/projects/{project_id}/search/semantic",
        json={"query": "How is authentication handled?"},
        headers=headers
    )
    assert search_resp.status_code == 200
    search_data = search_resp.json()
    assert search_data["total_results"] > 0

    # Test dependencies graph
    dep_resp = client.get(f"/api/v1/projects/{project_id}/dependencies", headers=headers)
    assert dep_resp.status_code == 200
    dep_data = dep_resp.json()
    assert len(dep_data["nodes"]) > 0

    # Test analysis report
    analysis_resp = client.get(f"/api/v1/projects/{project_id}/analysis", headers=headers)
    assert analysis_resp.status_code == 200
    analysis_data = analysis_resp.json()
    assert "summary" in analysis_data
    assert len(analysis_data["items"]) > 0

    # Test test run
    test_run_resp = client.post(
        f"/api/v1/projects/{project_id}/tests/run",
        json={"test_path": "tests"},
        headers=headers
    )
    assert test_run_resp.status_code == 200
    test_data = test_run_resp.json()
    assert test_data["status"] == "PASSED"
    assert test_data["passed_count"] > 0
