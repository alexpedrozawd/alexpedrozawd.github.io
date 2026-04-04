from fastapi import APIRouter, HTTPException, Request

from app.core.security import limiter
from app.core.config import get_settings
from app.schemas.base import Link
from app.schemas.contact import ContactRequest, ContactResponse
from app.services import contact_service

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=ContactResponse, status_code=201)
@limiter.limit(get_settings().rate_limit_contact)
async def send_contact(
    request: Request,
    payload: ContactRequest,
) -> ContactResponse:
    try:
        await contact_service.send_contact_email(payload)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Falha ao enviar a mensagem. Tente novamente mais tarde.",
        )
    return ContactResponse(
        success=True,
        message="Mensagem enviada com sucesso! Responderei em breve.",
        links={
            "self": Link(href="/api/v1/contact/", method="POST"),
            "projects": Link(href="/api/v1/projects/"),
        },
    )
