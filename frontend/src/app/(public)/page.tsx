'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Globe, 
  Layers, 
  Terminal, 
  Smartphone,
  Bot, 
  Briefcase, 
  Cpu, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { HeroCanvas } from '@/components/3d/HeroCanvas';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GlobalServiceArea } from '@/components/ui/GlobalServiceArea';
import { api, AGENCY_METADATA } from '@/lib/api';

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [projData, servData] = await Promise.all([
        api.public.getProjects(true),
        api.public.getServices(),
      ]);
      setProjects(projData);
      setServices(servData);
    }
    loadData();
  }, []);

  const getServiceIcon = (slug: string, index: number) => {
    if (slug?.includes('web') && !slug?.includes('saas')) return <Globe className="w-6 h-6" />;
    if (slug?.includes('python')) return <Terminal className="w-6 h-6" />;
    if (slug?.includes('mobile') || slug?.includes('app')) return <Smartphone className="w-6 h-6" />;
    if (slug?.includes('ai') || slug?.includes('automation')) return <Bot className="w-6 h-6" />;
    if (slug?.includes('business')) return <Briefcase className="w-6 h-6" />;
    if (slug?.includes('software') || slug?.includes('saas')) return <Layers className="w-6 h-6" />;
    return <Cpu className="w-6 h-6" />;
  };

  return (
    <div className="relative overflow-hidden bg-brand-dark">
      {/* ==================================================== */}
      {/* 1. HERO SECTION WITH 3D CANVAS */}
      {/* ==================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-24 overflow-hidden border-b border-slate-900">
        {/* 3D WebGL Canvas Layer */}
        <HeroCanvas />

        {/* Ambient Radial Lighting Overlays */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technology & Digital Solutions Company</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Reliable IT Services to <span className="text-gradient-cyan">Help Businesses Grow</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Infotech delivers modern website development, custom software solutions, Python engineering, AI automation, and technical support for individuals, startups, and organizations worldwide.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl shadow-cyan-500/25">
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Services
              </Button>
            </Link>
          </div>

          {/* Core Offerings Ticker */}
          <div className="mt-16 pt-8 border-t border-slate-800/60 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Website Development</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400"></span>Software Solutions</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span>Python Engineering</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-400"></span>Flutter & Mobile Apps</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400"></span>AI & Automation</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Business Applications</span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. AGENCY METRICS & STATS */}
      {/* ==================================================== */}
      <section className="py-16 bg-slate-950/60 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <p className="text-4xl font-black text-cyan-400">20</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-medium">Countries Served Globally</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <p className="text-4xl font-black text-white">48+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-medium">Successful Deployments</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <p className="text-4xl font-black text-indigo-400">99.4%</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-medium">Client Satisfaction</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <p className="text-4xl font-black text-emerald-400">24 / 7</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-medium">AI & Technical Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. CORE SERVICES SHOWCASE */}
      {/* ==================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" className="mb-3">Our Core Services</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Practical, Scalable & Affordable IT Solutions
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            From modern business websites to custom Python backends, AI automation systems, and enterprise management tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={service.id || index} className="relative overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                    {getServiceIcon(service.slug, index)}
                  </div>
                  {service.starting_price && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-300">
                      {service.starting_price}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {service.short_description}
                </p>

                {service.features && (
                  <ul className="space-y-2 mb-6 text-xs text-slate-400 font-medium">
                    {service.features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 gap-1.5">
                  <span>Get Started with {service.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. GLOBAL SERVICE AREA SECTION */}
      {/* ==================================================== */}
      <GlobalServiceArea />

      {/* ==================================================== */}
      {/* 5. SHOWCASE PORTFOLIO PROJECTS */}
      {/* ==================================================== */}
      <section id="projects" className="py-24 bg-slate-950/80 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <Badge variant="indigo" className="mb-3">Featured Deployments</Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Software & AI Solutions in Production
              </h2>
            </div>
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Discuss Your Requirements
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/50 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-700 text-cyan-400">
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tech_stack?.map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 gap-1"
                    >
                      <span>Explore Case Study</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. FOUNDER & LEAD ARCHITECT SPOTLIGHT */}
      {/* ==================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            {/* Founder Avatar & Badge */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-xl shadow-cyan-500/30">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <Terminal className="w-14 h-14 text-cyan-400" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950" title="Active"></span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{AGENCY_METADATA.founder}</h3>
                <p className="text-sm font-medium text-cyan-400">Founder & Lead Software Architect</p>
                <p className="text-xs text-slate-400 mt-1">Direct Technical Consultation</p>
              </div>
            </div>

            {/* Bio & Philosophy */}
            <div className="space-y-4 lg:col-span-2">
              <Badge variant="cyan">Leadership & Vision</Badge>
              <h4 className="text-2xl sm:text-3xl font-bold text-white">
                "Our goal is to help businesses grow with modern technology, user-friendly solutions, and professional service."
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Led by Mohammad Shahabuddin, <strong>Infotech</strong> focuses on delivering practical, scalable, and affordable technology solutions. Whether you need a business website, custom Python software, intelligent automation, or technical support, we are committed to your success.
              </p>

              {/* Direct Links */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={AGENCY_METADATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={AGENCY_METADATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={`mailto:${AGENCY_METADATA.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{AGENCY_METADATA.email}</span>
                </a>

                <a
                  href={AGENCY_METADATA.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-semibold text-cyan-300 border border-cyan-800/60 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>View Office on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. CALL TO ACTION */}
      {/* ==================================================== */}
      <section className="py-20 text-center relative border-t border-slate-900 bg-gradient-to-b from-brand-dark to-slate-950">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Accelerate Your Business Growth?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
            Get in touch with Mohammad Shahabuddin and the Infotech team to discuss your website, software, or automation project.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="primary">
                Start Your Project Consultation
              </Button>
            </Link>
            <a href={`mailto:${AGENCY_METADATA.email}`}>
              <Button size="lg" variant="outline">
                Direct Email: {AGENCY_METADATA.email}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
