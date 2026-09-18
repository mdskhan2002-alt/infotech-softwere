from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from datetime import datetime

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    service_interest = Column(String(100), default="Custom Software Development")
    budget = Column(String(50), nullable=True)
    timeline = Column(String(100), nullable=True)
    requirements = Column(JSON, default=list)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="NEW", index=True)          # NEW, CONTACTED, IN_PROGRESS, CLOSED
    lead_tier = Column(String(50), default="HOT", index=True)       # HOT, WARM, COLD
    qualification_score = Column(Integer, default=50)              # 0 to 100
    handoff_requested = Column(Boolean, default=False)
    preferred_channel = Column(String(50), default="WEBSITE")       # WEBSITE, WHATSAPP, VOICE
    language = Column(String(50), default="English")                # English, Hindi, Hinglish
    source = Column(String(50), default="WEBSITE")                  # WEBSITE, WHATSAPP, CHATBOT, DIRECT
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    icon = Column(String(100), default="Code")
    starting_price = Column(String(100), nullable=True)
    delivery_time = Column(String(100), nullable=True)
    features = Column(JSON, default=list)
    is_active = Column(Boolean, default=True, index=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    client = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    live_url = Column(Text, nullable=True)
    github_url = Column(Text, nullable=True)
    tech_stack = Column(JSON, default=list)
    is_featured = Column(Boolean, default=False, index=True)
    completion_date = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WhatsAppLog(Base):
    __tablename__ = "whatsapp_logs"

    id = Column(Integer, primary_key=True, index=True)
    from_number = Column(String(50), nullable=False)
    message_body = Column(Text, nullable=True)
    response_sent = Column(Text, nullable=True)
    status = Column(String(50), default="RECEIVED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
