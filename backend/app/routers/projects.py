import hashlib
import json

from fastapi import APIRouter, HTTPException, Response

from app.schemas.project import Project, ProjectsResponse
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["projects"])

_CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=60"


def _etag(data: object) -> str:
    digest = hashlib.md5(
        json.dumps(data, default=str, sort_keys=True).encode()
    ).hexdigest()
    return f'"{digest}"'


@router.get("/", response_model=ProjectsResponse)
def list_projects(response: Response) -> ProjectsResponse:
    data = project_service.get_all_projects()
    response.headers["Cache-Control"] = _CACHE_CONTROL
    response.headers["ETag"] = _etag([p.model_dump() for p in data.projects])
    response.headers["Vary"] = "Accept"
    return data


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int, response: Response) -> Project:
    project = project_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    response.headers["Cache-Control"] = _CACHE_CONTROL
    response.headers["ETag"] = _etag(project.model_dump())
    response.headers["Vary"] = "Accept"
    return project
