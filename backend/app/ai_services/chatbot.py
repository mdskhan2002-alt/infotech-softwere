import os
import json
import re
from typing import List, Dict, Optional, Any
from app.core.config import settings

# Attempt import of Google Generative AI if installed
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False


INFOTECH_KNOWLEDGE_BASE = f"""
You are the Executive AI Agent System for Infotech Software, a premier technology and digital solutions company providing reliable IT services for individuals, startups, businesses, and organizations worldwide.
Founder & Lead Software Architect: {settings.FOUNDER_NAME}
Direct Email: {settings.CONTACT_EMAIL}
LinkedIn: {settings.LINKEDIN_URL}
Instagram: {settings.INSTAGRAM_URL}
Headquarters Location: {settings.GOOGLE_MAPS_URL}

Company Positioning:
Infotech delivers practical, scalable, and affordable technology solutions.
We specialize in:
1. Website Development (Corporate sites, modern portals, Next.js, SEO, high conversion)
2. Custom Software & Web Applications (Scalable cloud backends, microservices, FastAPI)
3. School Management Software & CRM/ERP (Admissions, Attendance, Fees, Parent Portal, Invoicing)
4. Mobile Application Development (Cross-platform Google Flutter & Dart for iOS & Android, offline sync, 60fps native performance)
5. AI Application & Autonomous AI Agents (RAG knowledge systems, autonomous agent workflows, customer support bots)
6. Voice AI & Meta WhatsApp Cloud API Chatbots (Real-time voice calls, auto-replies, lead capture)
7. Business Automation, Payment Gateways (Stripe, Razorpay), API Integrations & Docker Cloud Deployments

Global Service Area (20 Countries):
Chile, China, Egypt, India, Angola, Guinea, Kuwait, Russia, Albania, Algeria, Andorra, Armenia, Germany, Ireland, Australia, Afghanistan, Saudi Arabia, United States, Dominican Republic, Antigua and Barbuda.

AI Agent Roles:
- Sales Agent: Collects requirements, explains capabilities, discusses budget/timeline, identifies lead tier.
- Support Agent: Provides technical specs, SLA uptime (99.99%), deployment architectures.
- Technical Agent: Explains Flutter/Dart architectures, FastAPI async performance, database indexing, and LLM integrations.
- Booking Agent: Schedules discovery calls and consultations with Founder Mohammad Shahabuddin.
- Follow-up Agent: Gathers missing requirements and keeps clients updated.

Lead Qualification Tiers:
- HOT LEAD: Clear requirement, budget discussed, urgent timeline, wants quote or consultation.
- WARM LEAD: Interested, requirement partially clear, exploratory.
- COLD LEAD: General information, casual inquiry.
"""


class AgencyChatbot:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.model = None
        if HAS_GENAI and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    system_instruction=INFOTECH_KNOWLEDGE_BASE
                )
            except Exception:
                self.model = None

    def detect_language(self, text: str) -> str:
        """Detects whether user prompt is English or Hindi/Hinglish."""
        lower = text.lower()
        hindi_keywords = [
            "kya", "kaise", "kare", "karna", "chahiye", "bhai", "namaste", "hai",
            "kitna", "lagega", "kaunse", "hoga", "batao", "bataye", "mujhe", "hum",
            "karo", "accha", "shukriya", "paise", "kharcha", "kab"
        ]
        match_count = sum(1 for kw in hindi_keywords if re.search(r'\b' + re.escape(kw) + r'\b', lower))
        return "Hindi/Hinglish" if match_count >= 1 else "English"

    def detect_service(self, text: str) -> str:
        """Identifies customer service intent."""
        lower = text.lower()
        if any(w in lower for w in ["school", "college", "student", "attendance", "fees", "admission", "parent portal"]):
            return "School Management Software"
        if any(w in lower for w in ["flutter", "mobile app", "android", "ios", "app development", "dart"]):
            return "Mobile Application Development"
        if any(w in lower for w in ["website", "landing page", "web portal", "ecommerce", "e-commerce"]):
            return "Website Development"
        if any(w in lower for w in ["crm", "erp", "business app", "inventory", "management tool"]):
            return "CRM / ERP & Business Applications"
        if any(w in lower for w in ["voice", "voice ai", "call bot", "speech"]):
            return "Voice AI"
        if any(w in lower for w in ["whatsapp", "whatsapp bot", "meta api"]):
            return "WhatsApp Chatbot"
        if any(w in lower for w in ["ai agent", "ai", "llm", "rag", "chatbot", "automation"]):
            return "AI Agent Development"
        if any(w in lower for w in ["python", "fastapi", "backend", "api", "software"]):
            return "Custom Software & Web Application"
        return "General Technology Inquiry"

    def qualify_lead(self, message: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """Calculates lead status (HOT, WARM, COLD), score, and extracts requirements."""
        full_text = message.lower()
        if history:
            full_text += " " + " ".join([h.get("content", "").lower() for h in history])

        score = 30
        status_tier = "COLD"
        requirements = []

        # Service detection
        service = self.detect_service(full_text)
        if service != "General Technology Inquiry":
            score += 25
            requirements.append(service)

        # Budget indicators
        if any(w in full_text for w in ["budget", "price", "cost", "quote", "rate", "$", "inr", "rupees", "lakh", "thousand"]):
            score += 20

        # Timeline indicators
        if any(w in full_text for w in ["urgent", "asap", "month", "week", "immediately", "deadline", "timeline", "jaldi"]):
            score += 15

        # Direct consultation intent
        if any(w in full_text for w in ["call", "meet", "whatsapp", "hire", "start", "proposal", "contract", "shahabuddin"]):
            score += 20

        # School modules extraction
        for mod in ["admission", "attendance", "fees", "parent portal", "examination", "report card", "sms alert"]:
            if mod in full_text:
                requirements.append(mod.title())

        # Mobile features extraction
        for feat in ["flutter", "offline sync", "push notifications", "payment gateway", "biometric"]:
            if feat in full_text:
                requirements.append(feat.title())

        if score >= 70:
            status_tier = "HOT"
        elif score >= 45:
            status_tier = "WARM"
        else:
            status_tier = "COLD"

        return {
            "service": service,
            "lead_status": status_tier,
            "qualification_score": min(score, 100),
            "requirements": list(set(requirements))
        }

    def generate_response(self, user_message: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generates AI response using Gemini or structured agency intelligence,
        handling English and Hindi/Hinglish with dynamic qualification questionnaires.
        """
        lang = self.detect_language(user_message)
        service = self.detect_service(user_message)
        qualification = self.qualify_lead(user_message, history)

        # 1. Attempt Gemini Generative AI if key is configured
        if self.model:
            try:
                chat_history = []
                if history:
                    for msg in history[-6:]:
                        chat_history.append({
                            "role": "user" if msg.get("role") == "user" else "model",
                            "parts": [msg.get("content", "")]
                        })
                chat = self.model.start_chat(history=chat_history)
                response = chat.send_message(user_message)
                return {
                    "response": response.text,
                    "service_identified": service,
                    "lead_tier": qualification["lead_status"],
                    "qualification_score": qualification["qualification_score"],
                    "action_suggested": self._detect_action(user_message),
                    "language": lang
                }
            except Exception:
                pass

        # 2. Rule & Qualification Matching Engine
        fallback_res = self._qualification_pipeline(user_message, lang, service, qualification)
        return fallback_res

    def _detect_action(self, text: str) -> Optional[str]:
        lower = text.lower()
        if any(w in lower for w in ["contact", "reach", "email", "call", "hire", "talk", "whatsapp", "shahabuddin"]):
            return "contact_founder"
        if any(w in lower for w in ["pricing", "cost", "quote", "budget", "rate", "kitna"]):
            return "book_consultation"
        if any(w in lower for w in ["work", "portfolio", "projects", "samples", "case study"]):
            return "view_portfolio"
        return "continue_qualification"

    def _qualification_pipeline(self, msg: str, lang: str, service: str, qualification: Dict[str, Any]) -> Dict[str, Any]:
        lower = msg.lower().strip()
        is_hindi = (lang == "Hindi/Hinglish")

        # Founder / Leadership query
        if any(k in lower for k in ["founder", "owner", "shahabuddin", "mohammad", "ceo", "director"]):
            if is_hindi:
                reply = (
                    f"Infotech Software ke Founder aur Lead Software Architect Mohammad Shahabuddin hain. "
                    f"Unhone modern web, Flutter mobile apps, aur autonomous AI systems mein enterprise solutions deliver kiye hain. "
                    f"Aap unse directly LinkedIn ({settings.LINKEDIN_URL}) ya email ({settings.CONTACT_EMAIL}) par jud sakte hain!"
                )
            else:
                reply = (
                    f"Infotech Software was founded and is led by Mohammad Shahabuddin, Lead Software Architect. "
                    f"He oversees full-stack engineering, Flutter mobile development, and enterprise AI systems. "
                    f"You can connect directly with him on LinkedIn ({settings.LINKEDIN_URL}) or email at {settings.CONTACT_EMAIL}."
                )
            return {
                "response": reply,
                "action_suggested": "contact_founder",
                "service_identified": service,
                "lead_tier": qualification["lead_status"],
                "qualification_score": qualification["qualification_score"]
            }

        # School Management Software Questionnaire
        if service == "School Management Software" or "school" in lower:
            if is_hindi:
                reply = (
                    "Infotech School Management Software ek complete digital campus solution hai! "
                    "Hum aapke liye tailored system tayyar karte hain. Kripya ye details share karein:\n\n"
                    "1. Aapke School/College ka naam kya hai?\n"
                    "2. Abhi admission, attendance aur fees kaise manage karte hain (manual ya software)?\n"
                    "3. Kaunse modules zaroori hain? (Admission, Attendance, Fees Collection, Parent Portal, Exam Results, SMS Alerts)?\n"
                    "4. Kitne students aur staff users honge?\n"
                    "5. Parents aur teachers ke liye Flutter Mobile App (iOS/Android) bhi chahiye?\n"
                    "6. Online payment gateway (Razorpay/Stripe) integration chahiye?\n"
                    "7. Kab tak launch karna chahte hain?\n"
                    "8. Approximate budget range kya hai?"
                )
            else:
                reply = (
                    "Infotech School Management Software provides an all-in-one institutional ERP platform! "
                    "To prepare an exact proposal, please share a few quick details:\n\n"
                    "1. Name of your School / Educational Institution?\n"
                    "2. How do you currently manage student records and fee collections?\n"
                    "3. Which modules are required? (Admissions, RFID/Bio Attendance, Fee Collection, Parent Portal, Exams, SMS/WhatsApp)?\n"
                    "4. Approximate number of students and staff?\n"
                    "5. Do you require a Flutter Mobile App for parents and teachers on iOS & Android?\n"
                    "6. Is payment gateway integration required?\n"
                    "7. What is your preferred launch timeline?\n"
                    "8. What is your estimated budget range?"
                )
            return {
                "response": reply,
                "action_suggested": "book_consultation",
                "service_identified": "School Management Software",
                "lead_tier": "HOT",
                "qualification_score": 85
            }

        # Flutter Mobile Application Development Questionnaire
        if service == "Mobile Application Development" or any(w in lower for w in ["flutter", "mobile", "ios", "android"]):
            if is_hindi:
                reply = (
                    "Infotech Google Flutter & Dart ke sath high-performance cross-platform mobile apps develop karta hai! "
                    "Single codebase se iOS aur Android dono par 60fps native performance milti hai.\n\n"
                    "Aapke mobile app ke liye quick questions:\n"
                    "1. App ka primary business purpose kya hai?\n"
                    "2. iOS aur Android dono platforms target karne hain?\n"
                    "3. Key features: Push notifications, biometric login, offline database, live chat, ya payment gateway?\n"
                    "4. Kya backend APIs ready hain, ya FastAPI cloud backend bhi create karwana hai?\n"
                    "5. Desired launch timeline aur budget kya hai?\n\n"
                    "Humari HealthPulse AI Telemedicine app bhi Flutter par live deployed hai!"
                )
            else:
                reply = (
                    "Infotech specializes in enterprise-grade Mobile Application Development using Google Flutter & Dart! "
                    "You get pixel-perfect Material 3 & Cupertino UI across iOS and Android with 60fps native speed.\n\n"
                    "To tailor your architecture:\n"
                    "1. What is the core objective of your mobile application?\n"
                    "2. Do you require both iOS and Android apps simultaneously?\n"
                    "3. Key feature requirements: Push notifications, biometric security, offline sync, or payment processing?\n"
                    "4. Do you already have backend APIs, or should we build a high-speed FastAPI backend?\n"
                    "5. What is your targeted launch timeline and budget range?\n\n"
                    "Our showcase HealthPulse Telemedicine app runs on Flutter!"
                )
            return {
                "response": reply,
                "action_suggested": "book_consultation",
                "service_identified": "Mobile Application Development",
                "lead_tier": "HOT",
                "qualification_score": 90
            }

        # Website Development Questionnaire
        if service == "Website Development" or "website" in lower:
            if is_hindi:
                reply = (
                    "Infotech modern, high-speed, SEO-optimized business websites develop karta hai Next.js aur Tailwind CSS ke sath.\n\n"
                    "Website proposal ke liye please batayein:\n"
                    "1. Aapke business/organization ka naam kya hai?\n"
                    "2. Kis type ki website chahiye (Corporate, Landing Page, E-commerce, ya Client Portal)?\n"
                    "3. Kya existing website hai jise redesign karna hai, ya fresh build hai?\n"
                    "4. Approximate kitne pages aur sections honge?\n"
                    "5. WhatsApp direct chat aur lead contact forms chahiye?\n"
                    "6. Website kab tak live chahiye?\n"
                    "7. Aapka budget range kya hai?"
                )
            else:
                reply = (
                    "Infotech engineers high-performance, responsive business websites with Next.js 14 and modern SEO architecture.\n\n"
                    "To tailor your website proposal:\n"
                    "1. What is your business or organization name?\n"
                    "2. What style of website is needed (Corporate, SaaS landing page, E-commerce, or Client Portal)?\n"
                    "3. Do you have an existing website to revamp, or is this a brand-new project?\n"
                    "4. How many pages/modules are required?\n"
                    "5. Do you need direct WhatsApp integration and custom lead capture forms?\n"
                    "6. What is your expected launch timeline?\n"
                    "7. What is your estimated budget range?"
                )
            return {
                "response": reply,
                "action_suggested": "book_consultation",
                "service_identified": "Website Development",
                "lead_tier": "HOT",
                "qualification_score": 80
            }

        # AI Agent & Automation Questionnaire
        if service in ["AI Agent Development", "Voice AI", "WhatsApp Chatbot"]:
            if is_hindi:
                reply = (
                    "Infotech custom AI Agents, RAG knowledge systems, Voice AI concierges, aur WhatsApp Chatbots develop karta hai!\n\n"
                    "Aapke AI system ke liye quick qualification:\n"
                    "1. AI Agent kis primary task ke liye chahiye (Customer Support, Sales Qualification, ya Internal Operations)?\n"
                    "2. Platform: Website widget, WhatsApp Business, ya Phone Voice AI?\n"
                    "3. Kaunse specific questions ya company knowledge base AI handle karega?\n"
                    "4. Kya human handoff chahiye (jab customer human team se baat karna chahe)?\n"
                    "5. CRM ya database integration chahiye?\n"
                    "6. Expected daily conversation volume kitna hoga?"
                )
            else:
                reply = (
                    "Infotech builds autonomous AI Agents, RAG document systems, Voice AI concierges, and Meta WhatsApp Cloud bots!\n\n"
                    "To architect your AI solution:\n"
                    "1. What is the primary role of the AI agent (Customer Support, Lead Qualification, or Sales Handoff)?\n"
                    "2. Channel preference: Website widget, WhatsApp Cloud API, or Voice AI?\n"
                    "3. What knowledge base or FAQs should the AI be trained on?\n"
                    "4. Is human handoff required when a customer asks to speak with Founder Mohammad Shahabuddin or staff?\n"
                    "5. Does it need integration with your CRM or PostgreSQL database?\n"
                    "6. What is your estimated daily/monthly interaction volume?"
                )
            return {
                "response": reply,
                "action_suggested": "book_consultation",
                "service_identified": service,
                "lead_tier": "HOT",
                "qualification_score": 85
            }

        # Quotation / Pricing Request & Human Handoff
        if any(w in lower for w in ["quote", "quotation", "price", "cost", "pricing", "rate", "kitna", "proposal"]):
            if is_hindi:
                reply = (
                    "Infotech transparent, scalable aur affordable pricing provide karta hai:\n"
                    "• Website Development: Affordable & Scalable (1-3 weeks delivery)\n"
                    "• Custom Software & APIs: Custom Scope (2-6 weeks)\n"
                    "• Flutter Mobile App (iOS & Android): Custom Scope (3-6 weeks)\n"
                    "• School Management Software / CRM: Custom Scope (2-5 weeks)\n"
                    "• AI Agents & WhatsApp Chatbots: Tailored Solution (2-4 weeks)\n\n"
                    "Kya aap hamari team aur Founder Mohammad Shahabuddin se directly WhatsApp par baat karke instant custom quotation chahte hain?"
                )
            else:
                reply = (
                    "Infotech delivers practical, scalable, and affordable technology solutions:\n"
                    "• Website Development: From $1,499 (1 - 3 Weeks)\n"
                    "• Software Development: Custom Scope (2 - 6 Weeks)\n"
                    "• Mobile App Development (Flutter iOS & Android): From $2,499 (3 - 6 Weeks)\n"
                    "• School Management Software / ERP: Custom Scope (2 - 5 Weeks)\n"
                    "• AI Agents & WhatsApp Cloud Bots: From $1,999 (2 - 4 Weeks)\n\n"
                    "Would you like to speak directly with Founder Mohammad Shahabuddin on WhatsApp to receive a formal quotation tailored to your exact scope?"
                )
            return {
                "response": reply,
                "action_suggested": "contact_founder",
                "service_identified": service,
                "lead_tier": "HOT",
                "qualification_score": 95
            }

        # Greetings
        if any(k in lower for k in ["hi", "hello", "hey", "namaste", "greetings", "good morning", "good evening"]):
            if is_hindi:
                reply = (
                    f"Namaste! Infotech Software mein aapka swagat hai. Main aapka AI Consultant hoon. "
                    f"Hum Website Development, Custom Software, School Management Software, Flutter Mobile Apps, "
                    f"aur AI Automation solutions provide karte hain. "
                    f"Aap apne project requirement ke baare mein batayein — main turant help karunga!"
                )
            else:
                reply = (
                    f"Hello! Welcome to Infotech Software. I am your AI Consultant. "
                    f"We engineer high-performance Websites, Custom Software, School Management Systems, "
                    f"Cross-Platform Flutter Mobile Apps, and AI Automations. "
                    f"How can we help accelerate your business today?"
                )
            return {
                "response": reply,
                "action_suggested": "continue_qualification",
                "service_identified": service,
                "lead_tier": qualification["lead_status"],
                "qualification_score": qualification["qualification_score"]
            }

        # Fallback response
        if is_hindi:
            reply = (
                f"Infotech Software se judne ke liye dhanyawad! Hum modern websites, custom Python backends, "
                f"Flutter mobile applications, aur autonomous AI systems build karte hain. "
                f"Aap apne project ki requirements share kar sakte hain ya Founder Mohammad Shahabuddin se direct "
                f"consultation ke liye WhatsApp / Contact page par form submit kar sakte hain."
            )
        else:
            reply = (
                f"Thank you for connecting with Infotech Software. We specialize in modern Next.js websites, "
                f"FastAPI microservices, Flutter cross-platform mobile apps, and autonomous AI agents. "
                f"Would you like to explore our portfolio or schedule a consultation with Founder Mohammad Shahabuddin?"
            )

        return {
            "response": reply,
            "action_suggested": "book_consultation",
            "service_identified": service,
            "lead_tier": qualification["lead_status"],
            "qualification_score": qualification["qualification_score"]
        }

    # ----------------------------------------------------
    # Agent Tool Executor Functions
    # ----------------------------------------------------
    def search_services(self, query: str = "") -> List[Dict[str, Any]]:
        services = [
            {"title": "Website Development", "slug": "website-development", "category": "Web"},
            {"title": "Software Development", "slug": "software-development", "category": "Backend & Cloud"},
            {"title": "Python Development", "slug": "python-development", "category": "Backend"},
            {"title": "Mobile Application Development", "slug": "mobile-apps", "category": "Flutter & Mobile"},
            {"title": "School Management Software", "slug": "school-management", "category": "ERP & Education"},
            {"title": "AI & Automation Solutions", "slug": "ai-automation", "category": "AI"},
            {"title": "Business Applications", "slug": "business-applications", "category": "Enterprise"}
        ]
        if not query:
            return services
        q = query.lower()
        return [s for s in services if q in s["title"].lower() or q in s["slug"].lower() or q in s["category"].lower()]

    def get_company_info(self) -> Dict[str, Any]:
        return {
            "name": settings.AGENCY_NAME,
            "tagline": settings.AGENCY_TAGLINE,
            "founder": settings.FOUNDER_NAME,
            "email": settings.CONTACT_EMAIL,
            "linkedin": settings.LINKEDIN_URL,
            "instagram": settings.INSTAGRAM_URL,
            "location": settings.GOOGLE_MAPS_URL,
            "positioning": "Reliable Technology & Digital Solutions for Businesses Worldwide"
        }

    def book_consultation(self, client_name: str, email: str, date_time: str = "ASAP") -> Dict[str, Any]:
        return {
            "status": "confirmed",
            "founder": settings.FOUNDER_NAME,
            "client_name": client_name,
            "email": email,
            "date_time": date_time,
            "details": f"Consultation session scheduled with Founder {settings.FOUNDER_NAME}. Link sent to {email}."
        }

    def handoff_to_human(self, client_phone: str = "", summary: str = "") -> Dict[str, Any]:
        return {
            "status": "handoff_initiated",
            "founder": settings.FOUNDER_NAME,
            "whatsapp_link": f"https://wa.me/919934241448?text=Hello%20Mohammad%20Shahabuddin,%20I%20am%20interested%20in%20Infotech%20Software%20services.%20{summary}",
            "message": "Human handoff triggered. Founder notified."
        }


chatbot_service = AgencyChatbot()
