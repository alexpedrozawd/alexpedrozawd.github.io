"""In-memory project data service. Replace with a DB in production."""
from app.schemas.project import Project, ProjectsResponse

_PROJECTS: list[Project] = [
    Project(
        id=1,
        title="Projeto Alpha",
        description="Em breve...",
        status="coming_soon",
        tags=[],
        icon="⚔️",
    ),
    Project(
        id=2,
        title="Projeto Beta",
        description="Em breve...",
        status="coming_soon",
        tags=[],
        icon="🛡️",
    ),
    Project(
        id=3,
        title="Projeto Gamma",
        description="Em breve...",
        status="coming_soon",
        tags=[],
        icon="🔮",
    ),
]


def get_all_projects() -> ProjectsResponse:
    return ProjectsResponse(projects=_PROJECTS, total=len(_PROJECTS))


def get_project_by_id(project_id: int) -> Project | None:
    return next((p for p in _PROJECTS if p.id == project_id), None)
