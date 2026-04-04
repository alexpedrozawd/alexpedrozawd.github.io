"""Shared base schemas — HATEOAS link model."""
from pydantic import BaseModel


class Link(BaseModel):
    href: str
    method: str = "GET"
