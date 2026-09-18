from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
import json


class Settings(BaseSettings):
    PROJECT_NAME: str = "Infotech Software API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-super-secret-key-infotech-2026-xyz987654321")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgrespassword@localhost:5432/infotech_db"
    )

    # Initial Admin Seed
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@infotechsoftware.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminSecurePassword2026!")
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Mohammad Shahabuddin")

    # Agency & Founder Contact Metadata
    AGENCY_NAME: str = "Infotech"
    AGENCY_TAGLINE: str = "Reliable Technology & Digital Solutions for Businesses Worldwide"
    FOUNDER_NAME: str = "Mohammad Shahabuddin"
    CONTACT_EMAIL: str = "mdskhan2002@gmail.com"
    LINKEDIN_URL: str = "https://www.linkedin.com/in/mohammad-shahabuddin-887832343?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    INSTAGRAM_URL: str = "https://www.instagram.com/shahabuddin_7.7?igsh=MXFqbnh0bHVlNjlwcQ=="
    GOOGLE_MAPS_URL: str = "https://maps.app.goo.gl/dsZvoZ6Va3HsuxCG9"

    # AI Integrations
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # WhatsApp Cloud API Webhooks
    WHATSAPP_API_TOKEN: str = os.getenv("WHATSAPP_API_TOKEN", "")
    WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    WHATSAPP_VERIFY_TOKEN: str = os.getenv("WHATSAPP_VERIFY_TOKEN", "infotech_webhook_verification_token_2026")

    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
