from pydantic import BaseModel, EmailStr, Field, field_validator
from app.schemas.base import Link
from app.core.security import sanitize_text


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

    @field_validator("name", "subject", "message")
    @classmethod
    def strip_dangerous_chars(cls, value: str) -> str:
        cleaned = sanitize_text(value)
        if not cleaned:
            raise ValueError("Field must not be empty after sanitization.")
        return cleaned

    @field_validator("name")
    @classmethod
    def validate_name_length(cls, value: str) -> str:
        if len(value) > 120:
            raise ValueError("Name must be at most 120 characters.")
        return value

    @field_validator("subject")
    @classmethod
    def validate_subject_length(cls, value: str) -> str:
        if len(value) > 200:
            raise ValueError("Subject must be at most 200 characters.")
        return value

    @field_validator("message")
    @classmethod
    def validate_message_length(cls, value: str) -> str:
        if len(value) > 5000:
            raise ValueError("Message must be at most 5000 characters.")
        return value


class ContactResponse(BaseModel):
    success: bool
    message: str
    links: dict[str, Link] = Field(default_factory=dict)
