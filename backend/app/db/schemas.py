from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime


# ==========================================
# Authentication & User Schemas
# ==========================================
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "admin"
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None


# ==========================================
# Lead & Enquiry Schemas
# ==========================================
class LeadBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    service_interest: Optional[str] = "Custom Software Development"
    budget: Optional[str] = None
    timeline: Optional[str] = None
    requirements: Optional[List[str]] = []
    message: str = Field(..., min_length=5)
    source: Optional[str] = "WEBSITE"
    preferred_channel: Optional[str] = "WEBSITE"
    language: Optional[str] = "English"


class LeadCreate(LeadBase):
    lead_tier: Optional[str] = "HOT"
    qualification_score: Optional[int] = 50
    handoff_requested: Optional[bool] = False


class LeadUpdate(BaseModel):
    status: Optional[str] = None  # NEW, CONTACTED, IN_PROGRESS, CLOSED
    lead_tier: Optional[str] = None  # HOT, WARM, COLD
    qualification_score: Optional[int] = None
    handoff_requested: Optional[bool] = None
    notes: Optional[str] = None


class LeadResponse(LeadBase):
    id: int
    status: str
    lead_tier: Optional[str] = "HOT"
    qualification_score: Optional[int] = 50
    handoff_requested: Optional[bool] = False
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==========================================
# Service Schemas
# ==========================================
class ServiceBase(BaseModel):
    title: str
    slug: str
    short_description: str
    full_description: Optional[str] = None
    icon: Optional[str] = "Code"
    starting_price: Optional[str] = None
    delivery_time: Optional[str] = None
    features: List[str] = []
    is_active: bool = True
    display_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    icon: Optional[str] = None
    starting_price: Optional[str] = None
    delivery_time: Optional[str] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# Project Schemas
# ==========================================
class ProjectBase(BaseModel):
    title: str
    slug: str
    category: str
    client: Optional[str] = None
    description: str
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    tech_stack: List[str] = []
    is_featured: bool = False
    completion_date: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    client: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    completion_date: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# AI Chatbot & Voice Schemas
# ==========================================
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant" or "system"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    visitor_email: Optional[EmailStr] = None
    visitor_name: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    action_suggested: Optional[str] = None  # "book_consultation", "view_portfolio", "contact_founder"
    lead_created: bool = False
    service_identified: Optional[str] = None
    lead_tier: Optional[str] = None
    qualification_score: Optional[int] = None
    language: Optional[str] = None


class VoiceRequest(BaseModel):
    audio_transcript: str
    conversation_state: Optional[dict] = {}


class VoiceResponse(BaseModel):
    reply_text: str
    intent: Optional[str] = None
    confidence: float = 0.95
    suggested_action: Optional[str] = None


# ==========================================
# Agency Info & Dashboard Stats
# ==========================================
class AgencyInfoResponse(BaseModel):
    name: str
    tagline: str
    founder: str
    email: str
    linkedin: str
    instagram: str
    google_maps: str
    stats: dict


class DashboardStatsResponse(BaseModel):
    total_leads: int
    new_leads: int
    in_progress_leads: int
    closed_leads: int
    hot_leads: int = 0
    warm_leads: int = 0
    cold_leads: int = 0
    total_projects: int
    total_services: int
    recent_leads: List[LeadResponse]
