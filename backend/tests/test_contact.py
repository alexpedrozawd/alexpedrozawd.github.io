"""Unit tests for /api/v1/contact router."""
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient


VALID_PAYLOAD = {
    "name": "Gandalf",
    "email": "gandalf@middleearth.com",
    "subject": "You shall not pass",
    "message": "A wizard is never late, nor is he early.",
}


def test_contact_returns_200_when_email_succeeds(client: TestClient) -> None:
    with patch(
        "app.services.contact_service.send_contact_email",
        new_callable=AsyncMock,
    ) as mock_send:
        mock_send.return_value = None
        response = client.post("/api/v1/contact/", json=VALID_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True


def test_contact_returns_500_when_email_fails(client: TestClient) -> None:
    with patch(
        "app.services.contact_service.send_contact_email",
        new_callable=AsyncMock,
        side_effect=Exception("SMTP error"),
    ):
        response = client.post("/api/v1/contact/", json=VALID_PAYLOAD)
    assert response.status_code == 500


def test_contact_rejects_missing_name(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD, "name": ""}
    response = client.post("/api/v1/contact/", json=payload)
    assert response.status_code == 422


def test_contact_rejects_invalid_email(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD, "email": "not-an-email"}
    response = client.post("/api/v1/contact/", json=payload)
    assert response.status_code == 422


def test_contact_rejects_script_injection_in_name(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD, "name": "<script>alert(1)</script>"}
    response = client.post("/api/v1/contact/", json=payload)
    # After sanitization the name becomes empty → 422
    assert response.status_code == 422


def test_contact_rejects_overly_long_message(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD, "message": "x" * 5001}
    response = client.post("/api/v1/contact/", json=payload)
    assert response.status_code == 422
