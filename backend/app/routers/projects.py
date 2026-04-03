from fastapi import APIRouter, HTTPException

from app.schemas.project import Project, ProjectsResponse
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=ProjectsResponse)
def list_projects() -> ProjectsResponse:
    return project_service.get_all_projects()


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int) -> Project:
    project = project_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return project
