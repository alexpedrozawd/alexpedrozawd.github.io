"""Security utilities: rate limiter setup and security headers middleware."""
import re
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

limiter = Limiter(key_func=get_remote_address)

# Characters that are safe in user-supplied text (blocks HTML/script injection)
_DANGEROUS_PATTERN = re.compile(r"[<>\"'`;\\]")


def sanitize_text(value: str) -> str:
    """Strip dangerous characters from a user-supplied string."""
    return _DANGEROUS_PATTERN.sub("", value).strip()


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds standard security headers to every response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https://media.licdn.com; "
            "connect-src 'self' http://localhost:8000"
        )
        return response
