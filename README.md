# ⚡ INFOTECH SOFTWARE — Next-Gen AI & Full-Stack Digital Agency

A production-grade, enterprise fullstack repository engineered for high-performance web applications, autonomous AI agents, SaaS architectures, and cloud microservices.

---

## 👨‍💻 Founder & Leadership

- **Founder & Lead Software Architect:** **Mohammad Shahabuddin**
- **Direct Email:** [mdskhan2002@gmail.com](mailto:mdskhan2002@gmail.com)
- **LinkedIn:** [Mohammad Shahabuddin on LinkedIn](https://www.linkedin.com/in/mohammad-shahabuddin-887832343?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- **Instagram:** [@shahabuddin_7.7](https://www.instagram.com/shahabuddin_7.7?igsh=MXFqbnh0bHVlNjlwcQ==)
- **Headquarters Location:** [View on Google Maps](https://maps.app.goo.gl/dsZvoZ6Va3HsuxCG9)

---

## 🏛️ Architecture Overview

```text
infotech-software-workspace/
├── frontend/                     # Next.js 14 App Router (React, Tailwind CSS, Three.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/         # Public: Homepage (/), /about, /services, /contact
│   │   │   ├── (admin)/          # CMS: /admin/login, /admin/dashboard, /admin/leads
│   │   │   └── layout.tsx        # Global Layout shell & Chatbot Widget
│   │   ├── components/
│   │   │   ├── ui/               # Navbar, Footer, Buttons, Modals, Badges, ChatbotWidget
│   │   │   └── 3d/               # Three.js 3D WebGL Constellation Hero Canvas
│   │   ├── lib/                  # Axios API client connecting to FastAPI backend
│   │   ├── store/                # Zustand client state management (Auth, Leads CRM)
│   │   └── styles/               # Cyberpunk dark theme, glassmorphism, glowing CSS
│   ├── public/                   # SVG Icons, Logos, Assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── backend/                      # FastAPI (Python 3.11) — Core Logic, REST APIs & AI
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_public.py  # Public endpoints (Submit enquiry, services, projects, AI chat)
│   │   │   └── routes_admin.py   # Admin CMS endpoints (JWT Login, Stats, Leads, Projects)
│   │   ├── core/
│   │   │   ├── config.py         # Pydantic BaseSettings (.env loading & defaults)
│   │   │   └── security.py       # Bcrypt hashing, JWT tokens, OAuth2 bearer dependency
│   │   ├── db/
│   │   │   ├── database.py       # SQLAlchemy engine & SessionLocal with fallback
│   │   │   ├── models.py         # Tables: users, leads, services, projects, whatsapp_logs
│   │   │   └── schemas.py        # Pydantic request & response validation schemas
│   │   ├── ai_services/
│   │   │   ├── chatbot.py        # Agency RAG knowledge base + Google Gemini / LLM fallback
│   │   │   └── voice_agent.py    # Conversational Voice AI logic
│   │   └── webhooks/
│   │       └── whatsapp.py       # Meta WhatsApp Cloud API webhook receiver & auto-replies
│   ├── requirements.txt
│   ├── main.py                   # FastAPI Application Entry Point & Lifespan
│   └── Dockerfile
│
├── mobile/                       # Cross-Platform Flutter Companion App (iOS & Android)
│   ├── lib/
│   │   ├── core/                 # AppConstants, AppTheme (Dark Cyberpunk / Glassmorphism)
│   │   ├── models/               # ServiceModel, ProjectModel, LeadModel, ChatMessageModel
│   │   ├── screens/
│   │   │   ├── home_screen.dart  # Hero banner, services, featured apps, 20 countries, founder card
│   │   │   ├── services_screen.dart # Catalog, search filters, deliverables checklist
│   │   │   ├── ai_chat_screen.dart # AI intake with real-time lead tier qualification HUD & WhatsApp handoff
│   │   │   ├── contact_screen.dart # Client quotation brief form with technical deliverable chips
│   │   │   └── crm_leads_screen.dart # Mobile CRM pipeline with HOT/WARM/COLD filter & direct phone/WhatsApp
│   │   ├── services/             # ApiService (REST client, offline fallback intelligence, url_launcher)
│   │   └── main.dart             # App shell with persistent BottomNavigationBar
│   └── pubspec.yaml              # Flutter dependencies (http, google_fonts, url_launcher, intl)
│
├── database/                     # PostgreSQL Database Management
│   ├── migrations/               # Alembic database version control
│   │   ├── versions/             # Migration scripts (001_initial_schema.py)
│   │   └── env.py                # Migration runner
│   ├── alembic.ini               # Alembic configuration
│   └── init.sql                  # Initial schema, indexes, admin seed, sample data
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules for Node, Python, Next.js, and Docker
└── docker-compose.yml            # Single command to run Frontend + Backend + PostgreSQL
```

---

## 🚀 Quickstart Guide

### Option 1: Run with Docker Compose (Recommended)

Run the entire stack (PostgreSQL + FastAPI + Next.js) with a single command:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Spin up containers
docker-compose up --build
```

- **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
- **Backend API (FastAPI):** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL Database:** `localhost:5432` (`infotech_db`)

---

### Option 2: Run Locally (Standalone)

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

#### 3. Mobile Companion App (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```
Runs on Android emulator (connecting via `http://10.0.2.2:8000/api/v1`), iOS simulator, web, or physical device with built-in offline mock fallbacks.

---

## 🔄 Multi-Channel Customer Intake & Qualification Pipeline

```text
Customer (Website / WhatsApp / Voice / Mobile App)
   │
   ▼
AI Agent System
   ├── 1. Greeting & Language Detection (English & Hindi/Hinglish)
   ├── 2. Service Identification (Web, Flutter Mobile, School ERP, AI Agents)
   ├── 3. Dynamic Qualification Questions (8 questions for School, 5 for Flutter, 7 for Web, 6 for AI)
   ├── 4. Budget Range & Desired Timeline Scoping
   ├── 5. Lead Qualification Scoring (HOT >= 70, WARM >= 45, COLD < 45)
   └── 6. Instant Quote / Direct WhatsApp Handoff to Founder Mohammad Shahabuddin
   │
   ▼
CRM & Database (PostgreSQL / SQLite fallback)
   ├── Automated Lead Capture with Tier, Score, Requirements, and Channel
   └── Webhook Ingestion & Status Tracking
   │
   ▼
Infotech Engineering Team Follow-up
   └── Review in Web Admin CMS (/admin/leads) or Mobile CRM Screen
```

---

## 🔑 Default Admin Credentials

An initial administrative user is pre-seeded for accessing the Admin CMS portal:

- **Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@infotechsoftware.com`
- **Password:** `AdminSecurePassword2026!`

*(You can change this in your `.env` or the database at any time).*

---

## 🤖 AI & Multi-Channel Features

1. **Interactive Web AI Assistant Widget:**
   - Pre-loaded with Infotech Software service rates, tech stack, and company philosophy.
   - Connected to `/api/v1/public/ai/chat` with Google Gemini & rule engine.
   - Live lead qualification scoring and automatic PostgreSQL CRM ingestion.
2. **Mobile AI Intake Consultant (Flutter):**
   - Real-time lead qualification status bar (HOT/WARM/COLD, Score).
   - Fast questionnaire trigger chips (School ERP, Flutter, Websites, AI Bots, Hindi).
   - One-tap WhatsApp handoff pre-filling consultation context.
3. **Voice AI Consultant:**
   - Intent recognition and speech-optimized response generation (`/api/v1/public/ai/voice`).
4. **WhatsApp Business Cloud API Webhook:**
   - Ingests inbound WhatsApp messages from prospective leads (`/webhooks/whatsapp`).
   - Dynamically qualifies leads, tags tier, logs message, and responds automatically.

---

## 🌐 Public Pages & Features

- **Homepage (`/`):** 3D WebGL particle constellation canvas, agency metrics, core services, case studies, founder spotlight, and interactive contact CTA.
- **About (`/about`):** Engineering methodology, stack breakdown, founder vision, and direct social links.
- **Services (`/services`):** Catalog of AI automation, web & SaaS, mobile app development, and cloud DevOps with pricing and deliverable breakdowns.
- **Contact (`/contact`):** Lead capture form, response SLA, direct founder contact details, and Google Maps location.
- **Admin CMS (`/admin/dashboard`, `/admin/leads`):** Lead status management, notes, email reply triggers, and deletion actions.

---

## 📬 Contact & Inquiries

For technical consultations or custom software engineering projects:
- **Mohammad Shahabuddin**
- Email: [mdskhan2002@gmail.com](mailto:mdskhan2002@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/mohammad-shahabuddin-887832343](https://www.linkedin.com/in/mohammad-shahabuddin-887832343?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- Instagram: [https://www.instagram.com/shahabuddin_7.7](https://www.instagram.com/shahabuddin_7.7?igsh=MXFqbnh0bHVlNjlwcQ==)
- Office Location: [https://maps.app.goo.gl/dsZvoZ6Va3HsuxCG9](https://maps.app.goo.gl/dsZvoZ6Va3HsuxCG9)
# infotech-softwere
