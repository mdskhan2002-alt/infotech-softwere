from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.db.database import engine, Base, SessionLocal
from app.db.models import User, Service, Project
from app.core.security import get_password_hash
from app.api import routes_public, routes_admin
from app.webhooks import whatsapp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("infotech.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifespan context.
    Automatically provisions database schema and default records.
    """
    logger.info("Provisioning database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial admin and defaults if needed
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not existing_admin:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info(f"Initialized default admin account: {settings.ADMIN_EMAIL}")

        # Seed sample projects if none exist
        if db.query(Project).count() == 0:
            sample_projects = [
                Project(
                    title="CogniFlow Enterprise AI Hub",
                    slug="cogniflow-ai-hub",
                    category="AI & Automation",
                    client="Apex Global Logistics",
                    description="Autonomous multi-agent enterprise dispatch system with RAG document intelligence.",
                    image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                    live_url="https://infotechsoftware.com/projects/cogniflow",
                    github_url="https://github.com/infotechsoftware/cogniflow",
                    tech_stack=["FastAPI", "Next.js", "PostgreSQL", "Gemini Pro", "Docker"],
                    is_featured=True,
                    completion_date="January 2026"
                ),
                Project(
                    title="NexusPay Global Fintech Platform",
                    slug="nexuspay-fintech",
                    category="Web & SaaS",
                    client="Nexus Capital Group",
                    description="High-frequency institutional treasury and multi-currency payout processing engine.",
                    image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                    live_url="https://infotechsoftware.com/projects/nexuspay",
                    github_url="https://github.com/infotechsoftware/nexuspay",
                    tech_stack=["Next.js", "FastAPI", "PostgreSQL", "Kafka", "Docker"],
                    is_featured=True,
                    completion_date="December 2025"
                ),
                Project(
                    title="HealthPulse AI Telemedicine App",
                    slug="healthpulse-telemed",
                    category="Mobile Application",
                    client="BioCare Systems",
                    description="HIPAA-compliant telemedicine application with live encrypted WebRTC video consults.",
                    image_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                    live_url="https://infotechsoftware.com/projects/healthpulse",
                    github_url="https://github.com/infotechsoftware/healthpulse",
                    tech_stack=["Flutter", "Dart", "FastAPI", "PostgreSQL", "WebRTC", "Docker"],
                    is_featured=True,
                    completion_date="November 2025"
                )
            ]
            db.add_all(sample_projects)
            db.commit()

        # Seed sample services if none exist
        if db.query(Service).count() == 0:
            sample_services = [
                Service(
                    title="Website Development",
                    slug="website-development",
                    short_description="Modern, responsive, user-friendly business websites, landing pages, and web portals tailored to grow your brand.",
                    icon="Globe",
                    starting_price="Affordable & Scalable",
                    delivery_time="1 - 3 Weeks",
                    features=["Responsive Design & Cross-Browser", "Modern UX/UI & Fast Loading", "SEO Optimized Architecture", "CMS & Easy Maintenance"],
                    display_order=1
                ),
                Service(
                    title="Software Development",
                    slug="software-development",
                    short_description="Reliable, scalable custom software solutions, backend APIs, and digital systems built for individual and enterprise workflows.",
                    icon="Layers",
                    starting_price="Custom Scope",
                    delivery_time="2 - 6 Weeks",
                    features=["Custom Architecture & Clean Code", "Database Integration & REST APIs", "Enterprise Security Hardening", "Continuous Maintenance & Support"],
                    display_order=2
                ),
                Service(
                    title="Python Development",
                    slug="python-development",
                    short_description="High-performance Python backend systems, FastAPI microservices, data processing pipelines, and custom automation scripts.",
                    icon="Terminal",
                    starting_price="Affordable & Scalable",
                    delivery_time="1 - 4 Weeks",
                    features=["High-Speed FastAPI & Backend Logic", "Data Processing & Pipeline Engineering", "Web Scraping & 3rd-Party APIs", "Automated Scripting & Tooling"],
                    display_order=3
                ),
                Service(
                    title="Mobile Application Development",
                    slug="mobile-apps",
                    short_description="High-performance, cross-platform mobile apps for iOS and Android built with Flutter & Dart, offline sync, and real-time APIs.",
                    icon="Smartphone",
                    starting_price="Custom Scope",
                    delivery_time="3 - 6 Weeks",
                    features=["Cross-Platform Flutter & Dart Excellence", "Pixel-Perfect Native UI & Fluid 60fps Animations", "Offline-First SQLite/Hive Sync Engine", "App Store & Google Play Deployment"],
                    display_order=4
                ),
                Service(
                    title="AI & Automation Solutions",
                    slug="ai-automation",
                    short_description="Practical AI assistants, autonomous chatbots, workflow automation, and intelligent system integrations to optimize operations.",
                    icon="Bot",
                    starting_price="Tailored Solution",
                    delivery_time="2 - 4 Weeks",
                    features=["Smart AI Chatbots & Customer Assistants", "Workflow & Robotic Automation", "LLM & Machine Learning Integration", "Efficiency & Error Reduction"],
                    display_order=5
                ),
                Service(
                    title="Business Applications",
                    slug="business-applications",
                    short_description="Tailored business software, internal management tools, CRM/ERP platforms, and digital solutions engineered for growth.",
                    icon="Briefcase",
                    starting_price="Custom Scope",
                    delivery_time="3 - 6 Weeks",
                    features=["Custom CRM & ERP Portals", "Workflow & Inventory Management", "Role-Based Access & Security", "Cloud-Connected Dashboards"],
                    display_order=6
                )
            ]
            db.add_all(sample_services)
            db.commit()

    except Exception as e:
        logger.error(f"Startup provisioning error: {e}")
        db.rollback()
    finally:
        db.close()

    yield
    logger.info("FastAPI application shutting down...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Next-Generation Agency Core Logic, AI Automations & CRM Engine for Infotech Software",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Integrations
app.include_router(routes_public.router, prefix=f"{settings.API_V1_STR}/public", tags=["Public & Website"])
app.include_router(routes_admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin CMS"])
app.include_router(whatsapp.router, prefix="/webhooks", tags=["Webhooks"])


@app.get("/", tags=["System"])
def root_status():
    return {
        "agency": settings.AGENCY_NAME,
        "tagline": settings.AGENCY_TAGLINE,
        "founder": settings.FOUNDER_NAME,
        "email": settings.CONTACT_EMAIL,
        "social": {
            "linkedin": settings.LINKEDIN_URL,
            "instagram": settings.INSTAGRAM_URL,
            "google_maps": settings.GOOGLE_MAPS_URL
        },
        "status": "operational",
        "docs_url": "/docs",
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
