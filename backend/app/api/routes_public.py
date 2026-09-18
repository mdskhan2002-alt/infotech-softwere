from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.db.database import get_db
from app.db.models import Lead, Service, Project
from app.db.schemas import (
    LeadCreate, LeadResponse,
    ServiceResponse,
    ProjectResponse,
    AgencyInfoResponse,
    ChatRequest, ChatResponse,
    VoiceRequest, VoiceResponse
)
from app.core.config import settings
from app.ai_services.chatbot import chatbot_service
from app.ai_services.voice_agent import voice_agent_service

router = APIRouter()


# ----------------------------------------------------
# 1. Company & Agency Information
# ----------------------------------------------------
@router.get("/agency-info", response_model=AgencyInfoResponse)
@router.get("/company")
def get_agency_information(db: Session = Depends(get_db)):
    """
    Returns public brand metadata, founder profile, positioning, and verified contact links:
    - Founder: Mohammad Shahabuddin
    - Email: mdskhan2002@gmail.com
    - Best Positioning: Reliable Technology & Digital Solutions for Businesses Worldwide
    - Service Areas: 20 Countries
    """
    projects_count = db.query(Project).count()
    services_count = db.query(Service).filter(Service.is_active == True).count()
    
    return {
        "name": settings.AGENCY_NAME,
        "tagline": settings.AGENCY_TAGLINE,
        "founder": settings.FOUNDER_NAME,
        "email": settings.CONTACT_EMAIL,
        "linkedin": settings.LINKEDIN_URL,
        "instagram": settings.INSTAGRAM_URL,
        "google_maps": settings.GOOGLE_MAPS_URL,
        "stats": {
            "projects_completed": 45 + projects_count,
            "client_satisfaction_rate": "99.4%",
            "active_services": services_count if services_count > 0 else 6,
            "countries_served": 20,
            "uptime_sla": "99.99%"
        }
    }


# ----------------------------------------------------
# 2. Contact & Lead Qualification Submission
# ----------------------------------------------------
@router.post("/contact", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def submit_enquiry(enquiry: LeadCreate, db: Session = Depends(get_db)):
    """
    Submits client project brief / quotation request.
    Stores complete lead qualification data (HOT/WARM/COLD, requirements, channel).
    """
    new_lead = Lead(
        name=enquiry.name,
        email=enquiry.email,
        phone=enquiry.phone,
        company=enquiry.company,
        service_interest=enquiry.service_interest,
        budget=enquiry.budget,
        timeline=enquiry.timeline,
        requirements=enquiry.requirements or [],
        message=enquiry.message,
        source=enquiry.source or "WEBSITE",
        status="NEW",
        lead_tier=enquiry.lead_tier or "HOT",
        qualification_score=enquiry.qualification_score or 80,
        handoff_requested=enquiry.handoff_requested or False,
        preferred_channel=enquiry.preferred_channel or "WEBSITE",
        language=enquiry.language or "English"
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead


# ----------------------------------------------------
# 3. Services & Catalog
# ----------------------------------------------------
@router.get("/services", response_model=List[ServiceResponse])
def get_public_services(db: Session = Depends(get_db)):
    """Retrieves all active agency services including Website, Software, Mobile (Flutter), AI."""
    services = db.query(Service).filter(Service.is_active == True).order_by(Service.display_order.asc()).all()
    return services


# ----------------------------------------------------
# 4. Portfolio Projects
# ----------------------------------------------------
@router.get("/projects", response_model=List[ProjectResponse])
@router.get("/portfolio", response_model=List[ProjectResponse])
def get_public_projects(featured_only: bool = False, db: Session = Depends(get_db)):
    """Retrieves showcase portfolio projects including Flutter HealthPulse and CogniFlow AI."""
    query = db.query(Project)
    if featured_only:
        query = query.filter(Project.is_featured == True)
    return query.order_by(Project.id.desc()).all()


# ----------------------------------------------------
# 5. Pricing Policy
# ----------------------------------------------------
@router.get("/pricing-policy")
def get_pricing_policy():
    """Returns transparent pricing policy and service tiers for prospective clients."""
    return {
        "policy": "Practical, Scalable & Affordable Technology Pricing",
        "currency_accepted": ["USD ($)", "INR (₹)", "EUR (€)"],
        "services": [
            {
                "service": "Website Development",
                "starting_price": "$1,499",
                "timeline": "1 - 3 Weeks",
                "features": ["Next.js 14 App Router", "Responsive UI", "SEO & Analytics", "CMS Integration"]
            },
            {
                "service": "Custom Software & Web Applications",
                "starting_price": "$2,999",
                "timeline": "2 - 6 Weeks",
                "features": ["FastAPI Async Microservices", "PostgreSQL Database", "REST/GraphQL APIs", "JWT Security"]
            },
            {
                "service": "Mobile Application Development",
                "starting_price": "$2,499",
                "timeline": "3 - 6 Weeks",
                "features": ["Google Flutter & Dart Cross-Platform", "iOS & Android", "Offline Sync", "60fps Native UI"]
            },
            {
                "service": "School Management Software / CRM",
                "starting_price": "Custom Scope",
                "timeline": "2 - 5 Weeks",
                "features": ["Admissions & Attendance", "Fee Collection & Invoicing", "Parent & Teacher Portal", "SMS/WhatsApp Alerts"]
            },
            {
                "service": "AI Agents & Intelligent Automation",
                "starting_price": "$1,999",
                "timeline": "2 - 4 Weeks",
                "features": ["Autonomous Task Agents", "RAG Document Intelligence", "24/7 Customer Support Bots", "WhatsApp Cloud API Integration"]
            }
        ],
        "payment_structure": "50% upfront milestone, 25% prototype review, 25% final deployment & training",
        "custom_quotations": "Connect directly with Founder Mohammad Shahabuddin on WhatsApp or via Contact form."
    }


# ----------------------------------------------------
# 6. Frequently Asked Questions (FAQ)
# ----------------------------------------------------
@router.get("/faq")
def get_frequently_asked_questions():
    """Returns answers to common client questions about development, mobile apps, and AI."""
    return {
        "faqs": [
            {
                "q": "Why choose Google Flutter for mobile application development?",
                "a": "Flutter allows compiling a single, clean Dart codebase directly into high-performance native machine code for both iOS and Android. This reduces development cost and time by 50% while delivering smooth 60fps animations, native gestures, and pixel-perfect Material 3/Cupertino UI."
            },
            {
                "q": "What modules are included in the School Management Software?",
                "a": "Our School Management platform includes Student Admissions, RFID/Biometric Attendance, Fee Collection & Invoicing with payment gateway, Parent/Teacher Communication Portal, Exam Marks & Report Cards, and optional Flutter Mobile Apps for parents."
            },
            {
                "q": "How does the AI Agent qualification and WhatsApp bot work?",
                "a": "Our AI Agents are powered by Meta WhatsApp Cloud API and Google Gemini. They greet clients in English or Hindi, ask key qualification questions, score leads (HOT/WARM/COLD), and offer seamless handoff directly to Founder Mohammad Shahabuddin."
            },
            {
                "q": "What is the typical project delivery timeline?",
                "a": "Business websites take 1-3 weeks. Custom software and Flutter mobile applications take 3-6 weeks. Rapid MVPs can be deployed in as little as 10 business days."
            },
            {
                "q": "Do you serve international clients outside India?",
                "a": "Yes! Infotech Software actively serves clients across 20 countries worldwide with dedicated remote engineering, zero-latency communication, and 99.99% uptime SLAs."
            }
        ]
    }


# ----------------------------------------------------
# 7. Location & 20 Countries Service Area
# ----------------------------------------------------
@router.get("/location")
def get_location_and_service_areas():
    """Returns headquarters details and global service areas."""
    return {
        "headquarters": {
            "name": "Infotech Software Headquarters",
            "founder": settings.FOUNDER_NAME,
            "maps_url": settings.GOOGLE_MAPS_URL,
            "email": settings.CONTACT_EMAIL
        },
        "service_area_count": 20,
        "regions_covered": [
            "North America (United States)",
            "South America (Chile)",
            "Caribbean (Dominican Republic, Antigua and Barbuda)",
            "Europe (Germany, Ireland, Albania, Andorra, Armenia, Russia)",
            "Asia (India, China, Afghanistan)",
            "Middle East (Saudi Arabia, Kuwait)",
            "Africa (Egypt, Algeria, Angola, Guinea)",
            "Oceania (Australia)"
        ]
    }


# ----------------------------------------------------
# 8. Business Hours & SLA
# ----------------------------------------------------
@router.get("/business-hours")
def get_business_hours():
    """Returns operating and technical support hours."""
    return {
        "ai_assistant_uptime": "24 / 7 / 365 Autonomous AI Support",
        "engineering_hours": "Monday - Saturday: 9:00 AM - 7:00 PM IST (UTC+5:30)",
        "emergency_sla": "Under 1-hour critical response for enterprise SaaS & Cloud clients",
        "direct_founder_access": "Founder Mohammad Shahabuddin available for scheduled video discovery sessions"
    }


# ----------------------------------------------------
# 9. Technology Stack
# ----------------------------------------------------
@router.get("/technology")
def get_technology_stack():
    """Returns verified tech stack used across agency builds."""
    return {
        "mobile": ["Google Flutter", "Dart", "Provider / Riverpod", "SQLite / Hive", "Material 3"],
        "frontend": ["Next.js 14 App Router", "React 18", "Tailwind CSS", "Three.js WebGL", "Zustand"],
        "backend": ["Python 3.11+", "FastAPI", "Uvicorn", "SQLAlchemy 2.0", "Pydantic v2", "Jose JWT"],
        "databases": ["PostgreSQL 16", "SQLite Fallback", "Redis Cache"],
        "ai_ml": ["Google Gemini 1.5 Pro / Flash", "Meta WhatsApp Cloud API", "LangChain RAG", "WebRTC Voice AI"],
        "devops": ["Docker", "Docker Compose", "Nginx", "GitHub Actions CI/CD", "AWS / DigitalOcean"]
    }


# ----------------------------------------------------
# 10. Engineering Process
# ----------------------------------------------------
@router.get("/process")
def get_development_process():
    """Returns our 6-step production engineering methodology."""
    return {
        "steps": [
            {"step": 1, "name": "Discovery & Requirements", "desc": "Customer requirement gathering, tech stack selection, and milestone scoping."},
            {"step": 2, "name": "Architecture & Prototyping", "desc": "Interactive UI/UX design, database schema modeling, and API contract design."},
            {"step": 3, "name": "Sprint Development", "desc": "Agile full-stack and Flutter mobile sprints with daily commits and code reviews."},
            {"step": 4, "name": "Senior Deep Audit & QA", "desc": "Unit testing, security penetration audit, performance profiling, and bug fixes."},
            {"step": 5, "name": "Cloud Deployment", "desc": "Dockerized container deployment, SSL, CDN configuration, and app store publishing."},
            {"step": 6, "name": "Continuous SLA Support", "desc": "24/7 uptime monitoring, scheduled backups, and feature iterations."}
        ]
    }


# ----------------------------------------------------
# 11. AI Chatbot Interaction with Qualification
# ----------------------------------------------------
@router.post("/ai/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """
    AI Consultant interaction endpoint.
    Performs language detection (English/Hindi), service identification,
    interactive qualification questionnaires, and lead status scoring (HOT/WARM/COLD).
    """
    history_dicts = [h.model_dump() for h in request.history] if request.history else []
    result = chatbot_service.generate_response(request.message, history=history_dicts)

    lead_created = False
    # Capture lead in database if visitor provided contact info
    if request.visitor_email:
        existing = db.query(Lead).filter(Lead.email == request.visitor_email).first()
        if not existing:
            lead = Lead(
                name=request.visitor_name or "AI Chat Visitor",
                email=request.visitor_email,
                message=f"[AI Chat Session]: {request.message}",
                service_interest=result.get("service_identified", "AI & Software Development"),
                lead_tier=result.get("lead_tier", "HOT"),
                qualification_score=result.get("qualification_score", 75),
                source="CHATBOT",
                status="NEW"
            )
            db.add(lead)
            db.commit()
            lead_created = True

    return {
        "response": result["response"],
        "action_suggested": result.get("action_suggested"),
        "lead_created": lead_created,
        "service_identified": result.get("service_identified"),
        "lead_tier": result.get("lead_tier"),
        "qualification_score": result.get("qualification_score"),
        "language": result.get("language")
    }


# ----------------------------------------------------
# 12. Voice AI Agent
# ----------------------------------------------------
@router.post("/ai/voice", response_model=VoiceResponse)
def voice_agent_consultation(request: VoiceRequest):
    """Voice AI agent endpoint for processing audio transcripts and spoken answers."""
    result = voice_agent_service.process_voice_input(
        transcript=request.audio_transcript,
        state=request.conversation_state
    )
    return result


# ----------------------------------------------------
# 13. Agent Tools Execution Endpoint
# ----------------------------------------------------
@router.post("/ai/agent/tools")
def execute_agent_tool(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Direct endpoint for autonomous agent tool invocations:
    - search_services
    - get_company_info
    - create_lead
    - update_lead
    - send_whatsapp
    - book_consultation
    - get_project_status
    - handoff_to_human
    """
    tool_name = payload.get("tool_name", "")
    args = payload.get("args", {})

    if tool_name == "search_services":
        return chatbot_service.search_services(args.get("query", ""))
    elif tool_name == "get_company_info":
        return chatbot_service.get_company_info()
    elif tool_name == "book_consultation":
        return chatbot_service.book_consultation(
            client_name=args.get("name", "Client"),
            email=args.get("email", ""),
            date_time=args.get("date_time", "ASAP")
        )
    elif tool_name == "handoff_to_human":
        return chatbot_service.handoff_to_human(
            client_phone=args.get("phone", ""),
            summary=args.get("summary", "")
        )
    elif tool_name == "create_lead":
        new_lead = Lead(
            name=args.get("name", "Incoming Lead"),
            email=args.get("email", "lead@infotechsoftware.com"),
            phone=args.get("phone"),
            company=args.get("business"),
            service_interest=args.get("service", "Custom Software"),
            requirements=args.get("requirements", []),
            budget=args.get("budget", "Discuss"),
            timeline=args.get("timeline", "2 months"),
            message=args.get("message", "Created via Agent tool"),
            lead_tier=args.get("lead_status", "HOT"),
            status="NEW",
            source="AI_AGENT"
        )
        db.add(new_lead)
        db.commit()
        db.refresh(new_lead)
        return {"status": "success", "lead_id": new_lead.id, "lead_tier": new_lead.lead_tier}
    elif tool_name == "get_project_status":
        project = db.query(Project).filter(Project.slug == args.get("slug")).first()
        if project:
            return {"title": project.title, "category": project.category, "completion": project.completion_date}
        return {"error": "Project not found"}
    else:
        raise HTTPException(status_code=400, detail=f"Unknown tool: {tool_name}")
