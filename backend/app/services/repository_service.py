import os
import shutil
import zipfile
import subprocess
import logging
from pathlib import Path
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.project import Project, Repository

logger = logging.getLogger(__name__)

class RepositoryService:
    @staticmethod
    def get_project_storage_path(project_id: str) -> Path:
        base_path = Path(settings.PROJECT_STORAGE_DIR).resolve()
        project_dir = base_path / project_id
        project_dir.mkdir(parents=True, exist_ok=True)
        return project_dir

    @classmethod
    def load_demo_repository(cls, project: Project, db: Session) -> Repository:
        """Copies the bundled demo repository files into the project storage directory."""
        dest_dir = cls.get_project_storage_path(project.id)
        # Clear any prior files in dest_dir
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        dest_dir.mkdir(parents=True, exist_ok=True)

        demo_source = Path(__file__).resolve().parent.parent / "demo_repo"
        if not demo_source.exists():
            raise FileNotFoundError(f"Demo repository source not found at {demo_source}")

        shutil.copytree(demo_source, dest_dir, dirs_exist_ok=True)

        # Update or create Repository model
        repo = db.query(Repository).filter(Repository.project_id == project.id).first()
        if not repo:
            repo = Repository(
                project_id=project.id,
                source_type="DEMO",
                local_path=str(dest_dir),
                default_branch="main"
            )
            db.add(repo)
        else:
            repo.source_type = "DEMO"
            repo.local_path = str(dest_dir)

        project.primary_language = "python"
        db.commit()
        db.refresh(repo)
        return repo

    @classmethod
    def clone_github_repository(cls, project: Project, repo_url: str, branch: str = "main", db: Session = None) -> Repository:
        """Clones a remote git repository into project storage using git CLI."""
        dest_dir = cls.get_project_storage_path(project.id)
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        dest_dir.mkdir(parents=True, exist_ok=True)

        try:
            logger.info(f"Cloning {repo_url} (depth 1) into {dest_dir}")
            subprocess.run(
                ["git", "clone", "--depth", "1", "--branch", branch, repo_url, str(dest_dir)],
                check=True,
                capture_output=True,
                text=True,
                timeout=120
            )
        except subprocess.CalledProcessError as e:
            logger.error(f"Git clone failed: {e.stderr}")
            # Fallback to clone without explicit branch in case default branch is master
            try:
                subprocess.run(
                    ["git", "clone", "--depth", "1", repo_url, str(dest_dir)],
                    check=True,
                    capture_output=True,
                    text=True,
                    timeout=120
                )
            except Exception as final_err:
                raise ValueError(f"Failed to clone repository: {str(final_err)}")

        repo = db.query(Repository).filter(Repository.project_id == project.id).first()
        if not repo:
            repo = Repository(
                project_id=project.id,
                source_type="GITHUB",
                remote_url=repo_url,
                default_branch=branch,
                local_path=str(dest_dir)
            )
            db.add(repo)
        else:
            repo.source_type = "GITHUB"
            repo.remote_url = repo_url
            repo.local_path = str(dest_dir)

        if db:
            db.commit()
            db.refresh(repo)
        return repo

    @classmethod
    def extract_zip_codebase(cls, project: Project, zip_file_bytes: bytes, db: Session) -> Repository:
        """Extracts uploaded zip archive with path traversal and zip bomb safety guards."""
        dest_dir = cls.get_project_storage_path(project.id)
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        dest_dir.mkdir(parents=True, exist_ok=True)

        temp_zip_path = dest_dir / "uploaded_archive.zip"
        with open(temp_zip_path, "wb") as f:
            f.write(zip_file_bytes)

        max_uncompressed_bytes = 150 * 1024 * 1024  # 150 MB safety limit
        total_extracted = 0

        with zipfile.ZipFile(temp_zip_path, "r") as zf:
            for member in zf.infolist():
                # Path traversal guard
                member_path = Path(member.filename)
                if ".." in member_path.parts or member_path.is_absolute():
                    continue

                target_path = (dest_dir / member.filename).resolve()
                if not str(target_path).startswith(str(dest_dir.resolve())):
                    continue

                total_extracted += member.file_size
                if total_extracted > max_uncompressed_bytes:
                    raise ValueError("Extracted archive exceeds size limit (150MB).")

                zf.extract(member, dest_dir)

        # Remove archive file after extraction
        if temp_zip_path.exists():
            os.remove(temp_zip_path)

        repo = db.query(Repository).filter(Repository.project_id == project.id).first()
        if not repo:
            repo = Repository(
                project_id=project.id,
                source_type="ZIP",
                local_path=str(dest_dir)
            )
            db.add(repo)
        else:
            repo.source_type = "ZIP"
            repo.local_path = str(dest_dir)

        db.commit()
        db.refresh(repo)
        return repo
