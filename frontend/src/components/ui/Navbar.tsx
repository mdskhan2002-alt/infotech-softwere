'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/#projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                INFOTECH
              </span>
              <span className="text-[10px] ml-1.5 font-semibold text-cyan-400 tracking-wider uppercase">
                IT Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  isActive(link.href) ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin/login">
              <span className="text-xs flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                CMS
              </span>
            </Link>
            <Link href="/contact">
              <Button size="sm" variant="primary">
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/admin/login" className="text-slate-400 p-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-brand-card/95 px-6 pt-4 pb-6 space-y-4 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-base font-medium ${
                isActive(link.href) ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button size="md" variant="primary" className="w-full">
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
