-- ==============================================================================
-- Infotech Software - Database Initialization Script
-- Author: Mohammad Shahabuddin (Founder & Lead Architect)
-- Email: mdskhan2002@gmail.com
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Admin / Staff authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Leads & Enquiries Table (Client Inquiries from Web, WhatsApp, AI Bot)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    service_interest VARCHAR(100) DEFAULT 'Custom Software Development',
    budget VARCHAR(50),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, CONTACTED, IN_PROGRESS, CLOSED, ARCHIVED
    source VARCHAR(50) DEFAULT 'WEBSITE', -- WEBSITE, WHATSAPP, CHATBOT, DIRECT
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    icon VARCHAR(100) DEFAULT 'Code',
    starting_price VARCHAR(100),
    delivery_time VARCHAR(100),
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Projects / Portfolio Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    client VARCHAR(255),
    description TEXT NOT NULL,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    completion_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. WhatsApp Inbound Messages Log
CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id SERIAL PRIMARY KEY,
    from_number VARCHAR(50) NOT NULL,
    message_body TEXT,
    response_sent TEXT,
    status VARCHAR(50) DEFAULT 'RECEIVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance queries
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Seed Default Admin User
-- Password: "AdminSecurePassword2026!" (Bcrypt hash: $2b$12$e8Y5M6vUfXwK.O1Q7zY44uV9w8wX0QY8i7c8m9P6E4J9tXg3bTfOu or dynamically created)
-- We insert an initial user if not already present
INSERT INTO users (email, hashed_password, full_name, role, is_active)
VALUES (
    'admin@infotechsoftware.com',
    '$2b$12$K1Aon9rY38WlyZJz9n5eCOf7nsq8NnZ5K/qQ7g9fQ1XU2X6451a5u', -- AdminSecurePassword2026!
    'Mohammad Shahabuddin',
    'admin',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Seed Initial Agency Services
INSERT INTO services (title, slug, short_description, full_description, icon, starting_price, delivery_time, features, is_active, display_order)
VALUES 
(
    'Website Development',
    'website-development',
    'Modern, responsive, user-friendly business websites, landing pages, and web portals tailored to grow your brand.',
    'End-to-end website engineering from custom UI/UX design to modern Next.js/React frontend development, SEO optimization, and fast global edge delivery.',
    'Globe',
    'Affordable & Scalable',
    '1 - 3 Weeks',
    '["Responsive Design & Cross-Browser", "Modern UX/UI & Fast Loading", "SEO Optimized Architecture", "CMS & Easy Maintenance"]'::jsonb,
    TRUE,
    1
),
(
    'Software Development',
    'software-development',
    'Reliable, scalable custom software solutions, backend APIs, and digital systems built for individual and enterprise workflows.',
    'Custom software architectures, secure database integration, robust REST APIs, and microservices engineered for performance and scalability.',
    'Layers',
    'Custom Scope',
    '2 - 6 Weeks',
    '["Custom Architecture & Clean Code", "Database Integration & REST APIs", "Enterprise Security Hardening", "Continuous Maintenance & Support"]'::jsonb,
    TRUE,
    2
),
(
    'Python Development',
    'python-development',
    'High-performance Python backend systems, FastAPI microservices, data processing pipelines, and custom automation scripts.',
    'Specialized Python development leveraging asynchronous FastAPI, data pipelines, automation scripting, and backend cloud integrations.',
    'Terminal',
    'Affordable & Scalable',
    '1 - 4 Weeks',
    '["High-Speed FastAPI & Backend Logic", "Data Processing & Pipeline Engineering", "Web Scraping & 3rd-Party APIs", "Automated Scripting & Tooling"]'::jsonb,
    TRUE,
    3
),
(
    'Mobile Application Development',
    'mobile-apps',
    'High-performance, cross-platform mobile apps for iOS and Android built with Flutter & Dart, offline sync, and real-time APIs.',
    'Native performance mobile applications engineered with Flutter and Dart, fluid 60fps animations, biometric security, and offline-first local databases.',
    'Smartphone',
    'Custom Scope',
    '3 - 6 Weeks',
    '["Cross-Platform Flutter & Dart Excellence", "Pixel-Perfect Native UI & Fluid 60fps Animations", "Offline-First SQLite/Hive Sync Engine", "App Store & Google Play Deployment"]'::jsonb,
    TRUE,
    4
),
(
    'AI & Automation Solutions',
    'ai-automation',
    'Practical AI assistants, autonomous chatbots, workflow automation, and intelligent system integrations to optimize operations.',
    'Custom LLM models, RAG document assistants, autonomous agent workflows, and AI voice agents for modern business automation.',
    'Bot',
    'Tailored Solution',
    '2 - 4 Weeks',
    '["Smart AI Chatbots & Customer Assistants", "Workflow & Robotic Automation", "LLM & Machine Learning Integration", "Efficiency & Error Reduction"]'::jsonb,
    TRUE,
    5
),
(
    'Business Applications',
    'business-applications',
    'Tailored business software, internal management tools, CRM/ERP platforms, and digital solutions engineered for growth.',
    'Custom CRM & ERP platforms, employee portals, real-time inventory management, and role-based access control systems.',
    'Briefcase',
    'Custom Scope',
    '3 - 6 Weeks',
    '["Custom CRM & ERP Portals", "Workflow & Inventory Management", "Role-Based Access & Security", "Cloud-Connected Dashboards"]'::jsonb,
    TRUE,
    6
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Showcase Projects
INSERT INTO projects (title, slug, category, client, description, image_url, live_url, github_url, tech_stack, is_featured, completion_date)
VALUES
(
    'CogniFlow Enterprise AI Hub',
    'cogniflow-ai-hub',
    'AI & Automation',
    'Apex Global Logistics',
    'Enterprise multi-agent autonomous system orchestrating customer dispatch, real-time voice calls, and automated inventory reconciliation.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://infotechsoftware.com/projects/cogniflow',
    'https://github.com/infotechsoftware/cogniflow',
    '["FastAPI", "Next.js", "PostgreSQL", "Gemini Pro", "LangChain", "Docker"]'::jsonb,
    TRUE,
    'January 2026'
),
(
    'NexusPay Global Fintech Platform',
    'nexuspay-fintech',
    'Web & SaaS',
    'Nexus Capital Group',
    'High-frequency institutional treasury and multi-currency payout processing engine handling over 50,000 transactions per second.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'https://infotechsoftware.com/projects/nexuspay',
    'https://github.com/infotechsoftware/nexuspay',
    '["React", "Next.js", "Python", "Redis", "Kafka", "PostgreSQL"]'::jsonb,
    TRUE,
    'December 2025'
),
(
    'HealthPulse AI Telemedicine App',
    'healthpulse-telemed',
    'Mobile Application',
    'BioCare Systems',
    'HIPAA-compliant telemedicine application with live encrypted WebRTC video consults, AI symptom triage, and e-prescriptions.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'https://infotechsoftware.com/projects/healthpulse',
    'https://github.com/infotechsoftware/healthpulse',
    '["Flutter", "Dart", "FastAPI", "PostgreSQL", "WebRTC", "Docker"]'::jsonb,
    TRUE,
    'November 2025'
)
ON CONFLICT (slug) DO NOTHING;
