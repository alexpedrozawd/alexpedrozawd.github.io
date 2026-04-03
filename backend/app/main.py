"""FastAPI application factory."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import get_settings
from app.core.security import SecurityHeadersMiddleware, limiter
from app.routers import contact, projects

settings = get_settings()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Alexandre Pedroza — Portfolio API",
        version="1.0.0",
        docs_url="/api/docs" if settings.app_debug else None,
        redoc_url="/api/redoc" if settings.app_debug else None,
    )

    # Rate limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.origins_list,
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "Accept"],
    )

    # Security headers
    app.add_middleware(SecurityHeadersMiddleware)

    # Routers
    app.include_router(projects.router, prefix="/api/v1")
    app.include_router(contact.router, prefix="/api/v1")

    @app.get("/health", tags=["health"])
    def health_check() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
