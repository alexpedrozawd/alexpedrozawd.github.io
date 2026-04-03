"""Service responsible for sending contact emails via SMTP."""
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.core.config import get_settings
from app.schemas.contact import ContactRequest

logger = logging.getLogger(__name__)


def _build_email_message(payload: ContactRequest) -> MIMEMultipart:
    settings = get_settings()
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Portfolio Contact] {payload.subject}"
    msg["From"] = settings.from_email or settings.smtp_user
    msg["To"] = settings.to_email
    msg["Reply-To"] = payload.email

    plain_body = (
        f"Nome: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Assunto: {payload.subject}\n\n"
        f"Mensagem:\n{payload.message}"
    )
    html_body = f"""
    <html><body style="font-family: serif; color: #1a1a2e; background:#f5f0e8; padding:24px;">
      <h2 style="color:#5c3d11;">📜 Nova mensagem do Portfólio</h2>
      <table>
        <tr><td><strong>Nome:</strong></td><td>{payload.name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>{payload.email}</td></tr>
        <tr><td><strong>Assunto:</strong></td><td>{payload.subject}</td></tr>
      </table>
      <hr/>
      <p><strong>Mensagem:</strong></p>
      <p style="white-space:pre-wrap;">{payload.message}</p>
    </body></html>
    """
    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))
    return msg


async def send_contact_email(payload: ContactRequest) -> None:
    """Send the contact form email. Raises on failure."""
    settings = get_settings()

    if not settings.smtp_user or not settings.smtp_password:
        logger.warning("SMTP credentials not configured. Email not sent.")
        return

    message = _build_email_message(payload)

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
        )
        logger.info("Contact email sent from %s", payload.email)
    except aiosmtplib.SMTPException as exc:
        logger.error("Failed to send contact email: %s", exc)
        raise
