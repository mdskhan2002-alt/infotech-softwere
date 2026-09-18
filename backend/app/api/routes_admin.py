from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from app.db.database import get_db
from app.db.models import User, Lead, Project, Service
from app.db.schemas import (
    UserLogin, Token, UserResponse,
    LeadResponse, LeadUpdate,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    DashboardStatsResponse
)
from app.core.security import verify_password, create_access_token, decode_access_token, oauth2_scheme, get_password_hash
from app.core.config import settings

router = APIRouter()


# ----------------------------------------------------
# Admin Authentication Dependency
# ----------------------------------------------------
def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user


# ----------------------------------------------------
# Authentication Endpoints
# ----------------------------------------------------
@router.post("/auth/login", response_model=Token)
def admin_login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticates admin user and returns JWT Bearer token."""
    user = db.query(User).filter(User.email == login_data.email).first()
    
    # Auto-seed admin user if table was empty
    if not user and login_data.email == settings.ADMIN_EMAIL:
        user = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            full_name=settings.ADMIN_NAME,
            role="admin",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_str = create_access_token(
        subject=user.email,
        expires_delta=access_token_expires
    )

    return {
        "access_token": token_str,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


@router.get("/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_admin)):
    """Returns currently authenticated admin user details."""
    return current_user


# ----------------------------------------------------
# Dashboard & Analytics
# ----------------------------------------------------
@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_statistics(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Calculates KPI metrics, lead pipelines, qualification tiers, and service metrics."""
    total_leads = db.query(Lead).count()
    new_leads = db.query(Lead).filter(Lead.status == "NEW").count()
    in_progress = db.query(Lead).filter(Lead.status == "IN_PROGRESS").count()
    closed_leads = db.query(Lead).filter(Lead.status == "CLOSED").count()
    hot_leads = db.query(Lead).filter(Lead.lead_tier == "HOT").count()
    warm_leads = db.query(Lead).filter(Lead.lead_tier == "WARM").count()
    cold_leads = db.query(Lead).filter(Lead.lead_tier == "COLD").count()
    total_projects = db.query(Project).count()
    total_services = db.query(Service).count()
    recent = db.query(Lead).order_by(Lead.created_at.desc()).limit(6).all()

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "in_progress_leads": in_progress,
        "closed_leads": closed_leads,
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "cold_leads": cold_leads,
        "total_projects": total_projects,
        "total_services": total_services,
        "recent_leads": recent
    }


# ----------------------------------------------------
# Leads Management Endpoints
# ----------------------------------------------------
@router.get("/leads", response_model=List[LeadResponse])
def list_leads(
    status_filter: Optional[str] = Query(None, alias="status"),
    tier_filter: Optional[str] = Query(None, alias="tier"),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Fetches leads with optional status filter (NEW, IN_PROGRESS, CLOSED) or tier filter (HOT, WARM, COLD)."""
    query = db.query(Lead)
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(Lead.status == status_filter.upper())
    if tier_filter and tier_filter.upper() != "ALL":
        query = query.filter(Lead.lead_tier == tier_filter.upper())
    return query.order_by(Lead.created_at.desc()).offset(skip).limit(limit).all()


@router.patch("/leads/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: int,
    lead_update: LeadUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Updates lead status or internal notes."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if lead_update.status:
        lead.status = lead_update.status.upper()
    if lead_update.lead_tier:
        lead.lead_tier = lead_update.lead_tier.upper()
    if lead_update.qualification_score is not None:
        lead.qualification_score = lead_update.qualification_score
    if lead_update.handoff_requested is not None:
        lead.handoff_requested = lead_update.handoff_requested
    if lead_update.notes is not None:
        lead.notes = lead_update.notes

    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(
    lead_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Deletes a lead from the database."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return None


# ----------------------------------------------------
# Portfolio Projects CMS Endpoints
# ----------------------------------------------------
@router.get("/projects", response_model=List[ProjectResponse])
def admin_list_projects(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Project).order_by(Project.id.desc()).all()


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project with this slug already exists")
    
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.patch("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


# ----------------------------------------------------
# Services CMS Endpoints
# ----------------------------------------------------
@router.get("/services", response_model=List[ServiceResponse])
def admin_list_services(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Service).order_by(Service.display_order.asc()).all()


@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: ServiceCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Service).filter(Service.slug == service_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service with this slug already exists")

    service = Service(**service_in.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.patch("/services/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_in: ServiceUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = service_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return None
