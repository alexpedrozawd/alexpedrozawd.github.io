from pydantic import BaseModel


class Project(BaseModel):
    id: int
    title: str
    description: str
    status: str  # "coming_soon" | "active" | "archived"
    tags: list[str]
    icon: str


class ProjectsResponse(BaseModel):
    projects: list[Project]
    total: int
