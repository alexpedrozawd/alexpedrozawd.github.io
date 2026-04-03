"""Unit tests for /api/v1/projects router."""
import pytest
from fastapi.testclient import TestClient


def test_list_projects_returns_200(client: TestClient) -> None:
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200


def test_list_projects_schema(client: TestClient) -> None:
    data = client.get("/api/v1/projects/").json()
    assert "projects" in data
    assert "total" in data
    assert data["total"] == len(data["projects"])


def test_list_projects_has_three_items(client: TestClient) -> None:
    data = client.get("/api/v1/projects/").json()
    assert data["total"] == 3


def test_get_project_by_valid_id(client: TestClient) -> None:
    response = client.get("/api/v1/projects/1")
    assert response.status_code == 200
    project = response.json()
    assert project["id"] == 1
    assert "title" in project
    assert "status" in project


def test_get_project_by_invalid_id_returns_404(client: TestClient) -> None:
    response = client.get("/api/v1/projects/9999")
    assert response.status_code == 404


def test_project_status_is_coming_soon(client: TestClient) -> None:
    data = client.get("/api/v1/projects/").json()
    for project in data["projects"]:
        assert project["status"] == "coming_soon"


def test_health_endpoint(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
