from pydantic import BaseModel, Field
from app.schemas.base import Link


class Project(BaseModel):
    id: int
    title: str
    description: str
    status: str  # "coming_soon" | "active" | "archived"
    tags: list[str]
    icon: str
    links: dict[str, Link] = Field(default_factory=dict)


class ProjectsResponse(BaseModel):
    projects: list[Project]
    total: int
    links: dict[str, Link] = Field(default_factory=dict)
