'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  ExternalLink, 
  CheckCircle, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  ArrowRight,
  Globe2,
  Sparkles,
  Bot,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { GlobalServiceArea } from '@/components/ui/GlobalServiceArea';
import { AGENCY_METADATA } from '@/lib/api';

export default function AboutPage() {
  const stack = [
    { name: 'Python & FastAPI', category: 'Core Backend' },
    { name: 'Next.js & React', category: 'Modern Frontend' },
    { name: 'Flutter & Dart', category: 'Cross-Platform Mobile' },
    { name: 'PostgreSQL & SQLite', category: 'Databases' },
    { name: 'AI & LLM Automations', category: 'Autonomous Systems' },
    { name: 'Docker & Cloud', category: 'Infrastructure' },
    { name: 'Business Web Apps', category: 'Client Portals' },
  ];

  const pillars = [
    {
      title: 'Reliable IT Services',
      description: 'Dependable technology solutions engineered for individuals, startups, expanding businesses, and large organizations.'
    },
    {
      title: 'Practical & Scalable',
      description: 'We avoid unnecessary complexity, focusing on affordable, user-friendly architectures that solve real operational bottlenecks.'
    },
    {
      title: 'Global Delivery Across 20 Countries',
      description: 'Serving clients worldwide with seamless remote communication, reliable delivery timelines, and ongoing digital support.'
    },
    {
      title: 'Modern AI & Python Specialization',
      description: 'State-of-the-art Python backends, high-speed APIs, and autonomous AI automation to accelerate business growth.'
    }
  ];

  return (
    <div className="py-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="cyan" className="mb-4">About Infotech</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Technology & Digital Solutions to <span className="text-gradient-cyan">Help Businesses Grow</span>
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Infotech is a technology and digital solutions company providing reliable IT services for individuals, startups, businesses, and organizations.
          </p>
        </div>

        {/* Mission Statement Box */}
        <div className="mb-20 p-8 sm:p-12 rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Our Vision & Mission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Practical, Scalable, and Affordable Technology Solutions
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              We offer website development, software solutions, digital services, Python development, AI and automation solutions, technical support, and customized IT solutions.
            </p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Our goal is to help businesses grow with modern technology, user-friendly solutions, and professional service. Whether you need a business website, software solution, automation system, or digital support, Infotech focuses on delivering practical, scalable, and affordable technology solutions.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 font-bold text-sm">
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Global Service Area */}
        <div className="mb-24">
          <GlobalServiceArea />
        </div>

        {/* Founder Section */}
        <div className="mb-24">
          <div className="p-8 sm:p-12 rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-2xl shadow-cyan-500/30 mb-6">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                    <Terminal className="w-16 h-16 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white">{AGENCY_METADATA.founder}</h3>
                <p className="text-sm font-semibold text-cyan-400">Founder & Lead Software Architect</p>
                <span className="text-xs text-slate-400 mt-1">Full-Stack & AI Systems Specialist</span>

                {/* Social Badges */}
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={AGENCY_METADATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={AGENCY_METADATA.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400 border border-slate-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${AGENCY_METADATA.email}`}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <h4 className="text-2xl font-bold text-white">
                  Leadership & Architectural Vision
                </h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Founded and led by <strong>Mohammad Shahabuddin</strong>, Infotech combines deep technical expertise across modern web frameworks, Python backends, and practical AI automation with a dedication to accessible, professional service.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-cyan-400 font-bold text-sm">Direct Architectural Oversight</p>
                    <p className="text-xs text-slate-400 mt-1">Every website, software system, and automation workflow is engineered to production standards.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-cyan-400 font-bold text-sm">Global Remote Delivery</p>
                    <p className="text-xs text-slate-400 mt-1">Serving clients across 20 countries with timely communication and transparent execution.</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <a
                    href={AGENCY_METADATA.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  >
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>View Headquarters on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold text-white">Our Technology Stack</h3>
            <p className="text-sm text-slate-400 mt-2">Proven, modern, and reliable tools built for high uptime and longevity.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stack.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center hover:border-cyan-500/30 transition-colors"
              >
                <p className="text-xs text-cyan-400 font-mono">{item.category}</p>
                <p className="text-sm font-bold text-white mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 rounded-3xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/20">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Have a Project in Mind?</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Discuss your requirements with Mohammad Shahabuddin and the Infotech team today.
          </p>
          <div className="mt-6">
            <Link href="/contact">
              <Button size="md" variant="primary">
                <span>Contact Us Today</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
