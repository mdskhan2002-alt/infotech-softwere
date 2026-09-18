'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Linkedin, Instagram, ExternalLink, Terminal, ArrowUpRight } from 'lucide-react';
import { AGENCY_METADATA } from '@/lib/api';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800/80 bg-brand-dark relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                INFOTECH
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Technology and digital solutions company providing reliable IT services for individuals, startups, businesses, and organizations worldwide.
            </p>
            <div className="pt-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Founder & Lead Architect</span>
              <p className="text-sm font-semibold text-slate-200">{AGENCY_METADATA.founder}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/services#website-development" className="hover:text-white transition-colors">Website Development</Link></li>
              <li><Link href="/services#software-development" className="hover:text-white transition-colors">Software Development</Link></li>
              <li><Link href="/services#python-development" className="hover:text-white transition-colors">Python Development</Link></li>
              <li><Link href="/services#mobile-apps" className="hover:text-white transition-colors">Mobile App Development (Flutter)</Link></li>
              <li><Link href="/services#ai-automation" className="hover:text-white transition-colors">AI & Automation Solutions</Link></li>
              <li><Link href="/services#business-applications" className="hover:text-white transition-colors">Business Applications</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Service Area</Link></li>
              <li><Link href="/#projects" className="hover:text-white transition-colors">Featured Works</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Connect & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Direct Contact</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <a 
                href={`mailto:${AGENCY_METADATA.email}`}
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors group"
              >
                <Mail className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span className="truncate">{AGENCY_METADATA.email}</span>
              </a>

              <a 
                href={AGENCY_METADATA.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors group"
              >
                <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>Office Location (Google Maps)</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </a>

              <div className="pt-3 flex items-center gap-3">
                <a
                  href={AGENCY_METADATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={AGENCY_METADATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/50 hover:bg-slate-800 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Infotech Software. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Founded & Engineered by <span className="text-slate-200 font-medium">{AGENCY_METADATA.founder}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
