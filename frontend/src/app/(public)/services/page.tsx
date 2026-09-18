'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Layers, 
  Terminal, 
  Smartphone,
  Bot, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlobalServiceArea } from '@/components/ui/GlobalServiceArea';

export default function ServicesPage() {
  const serviceCatalog = [
    {
      id: 'website-development',
      icon: Globe,
      title: 'Website Development',
      tagline: 'Modern, responsive, user-friendly business websites and portals that convert.',
      startingPrice: 'Affordable & Scalable',
      timeline: '1 - 3 Weeks',
      deliverables: [
        'High-speed responsive design for Mobile, Tablet, and Desktop',
        'Custom modern UI/UX design tailored to your brand identity',
        'Search Engine Optimization (SEO) & performance tuning',
        'CMS integration for effortless content updates',
        'Contact forms, lead capture, and Google Analytics integration'
      ]
    },
    {
      id: 'software-development',
      icon: Layers,
      title: 'Software Development',
      tagline: 'Reliable custom software architectures and systems built to scale.',
      startingPrice: 'Custom Scope',
      timeline: '2 - 6 Weeks',
      deliverables: [
        'Custom software design and clean, scalable architecture',
        'High-performance RESTful & GraphQL backend APIs',
        'Secure database architecture (PostgreSQL, SQLite, MySQL)',
        'Third-party API integrations and webhook automations',
        'Rigorous security hardening and continuous maintenance support'
      ]
    },
    {
      id: 'python-development',
      icon: Terminal,
      title: 'Python Development',
      tagline: 'High-performance Python backends, FastAPI APIs, data pipelines, and scripts.',
      startingPrice: 'Affordable & Scalable',
      timeline: '1 - 4 Weeks',
      deliverables: [
        'Modern asynchronous FastAPI & Django web applications',
        'Automated data processing pipelines and analytics scripts',
        'Web scraping, automation bots, and data extractors',
        'Custom Python CLI tools and internal developer utilities',
        'Microservices architecture and cloud-ready Docker packaging'
      ]
    },
    {
      id: 'mobile-apps',
      icon: Smartphone,
      title: 'Mobile Application Development',
      tagline: 'High-performance, cross-platform mobile apps for iOS and Android built with Flutter & Dart.',
      startingPrice: 'Custom Scope',
      timeline: '3 - 6 Weeks',
      deliverables: [
        'Cross-platform Flutter & Dart apps targeting iOS and Android from single codebase',
        'Pixel-perfect Material 3 & Cupertino native UI with smooth 60fps animations',
        'Offline-first architecture with local SQLite/Hive caching and background sync',
        'Secure biometric authentication (FaceID, Fingerprint) and push notifications',
        'End-to-end Apple App Store and Google Play Store deployment & compliance'
      ]
    },
    {
      id: 'ai-automation',
      icon: Bot,
      title: 'AI & Automation Solutions',
      tagline: 'Intelligent AI assistants, autonomous bots, and automated business workflows.',
      startingPrice: 'Tailored Solution',
      timeline: '2 - 4 Weeks',
      deliverables: [
        '24/7 AI Customer Support chatbots & lead capture assistants',
        'RAG (Retrieval-Augmented Generation) document intelligence systems',
        'Repetitive task and workflow robotic process automation',
        'Custom Gemini & OpenAI LLM integrations',
        'Error reduction and operational efficiency optimization'
      ]
    },
    {
      id: 'business-applications',
      icon: Briefcase,
      title: 'Business Applications',
      tagline: 'Practical CRM, ERP, and customized management tools engineered for growth.',
      startingPrice: 'Custom Scope',
      timeline: '3 - 6 Weeks',
      deliverables: [
        'Custom CRM (Customer Relationship Management) platforms',
        'Internal company portals, dashboards, and role-based access',
        'Order, inventory, and client tracking systems',
        'Automated invoicing, reporting, and real-time business metrics',
        'Multi-user collaboration with cloud sync and automated backups'
      ]
    }
  ];

  return (
    <div className="py-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="cyan" className="mb-4">Official Service Catalog</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Professional <span className="text-gradient-cyan">IT & Digital Solutions</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
            Infotech delivers reliable, practical, and scalable technology solutions for individuals, startups, businesses, and organizations worldwide.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-10 mb-20">
          {serviceCatalog.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="p-8 sm:p-12 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">{service.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{service.tagline}</p>

                    <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{service.startingPrice}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Timeline: {service.timeline}</span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                        <Button variant="primary" size="md">
                          <span>Request a Quote</span>
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-slate-950/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80">
                    <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4">
                      Key Deliverables & Inclusions
                    </h4>
                    <ul className="space-y-3">
                      {service.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Service Area Section */}
        <div className="mb-20">
          <GlobalServiceArea />
        </div>

        {/* Custom Solution Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Need a Tailored IT Solution?</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Whether you need a business website, software solution, automation system, or ongoing technical support, Infotech is ready to help you grow.
          </p>
          <div className="mt-6">
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Discuss Your Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
