"""In-memory project data service. Replace with a DB in production."""
from app.schemas.base import Link
from app.schemas.project import Project, ProjectsResponse

_BASE = "/api/v1/projects"

_PROJECTS: list[Project] = [
    Project(
        id=1,
        title="Projeto Alpha",
        description="Em breve...",
        status="coming_soon",
        tags=[],
        icon="⚔️",
        links={
            "self": Link(href=f"{_BASE}/1"),
            "collection": Link(href=f"{_BASE}/"),
        },
    ),
    Project(
        id=2,
        title="Projeto Beta",
        description="Em breve...",
        status="coming_soon",
        tags=[],
        icon="🛡️",
        links={
            "self": Link(href=f"{_BASE}/2"),
            "collection": Link(href=f"{_BASE}/"),
        },
    ),
    Project(
        id=3,
        title="Projeto Gamma",
        description="Em breve...",
        status="coming_soon",
        tags=[],
        icon="🔮",
        links={
            "self": Link(href=f"{_BASE}/3"),
            "collection": Link(href=f"{_BASE}/"),
        },
    ),
]


def get_all_projects() -> ProjectsResponse:
    return ProjectsResponse(
        projects=_PROJECTS,
        total=len(_PROJECTS),
        links={
            "self": Link(href=f"{_BASE}/"),
        },
    )


def get_project_by_id(project_id: int) -> Project | None:
    return next((p for p in _PROJECTS if p.id == project_id), None)
