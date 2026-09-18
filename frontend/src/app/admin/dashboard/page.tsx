'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  ExternalLink,
  MessageSquare,
  Mail,
  Linkedin
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api, AGENCY_METADATA } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    total_leads: 0,
    new_leads: 0,
    in_progress_leads: 0,
    closed_leads: 0,
    total_projects: 3,
    total_services: 4,
    recent_leads: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.admin.getStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline overview for Infotech Software & Founder {AGENCY_METADATA.founder}
          </p>
        </div>

        <Link href="/admin/leads">
          <Button size="sm" variant="primary">
            <span>Manage All Leads</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Inquiries</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats.total_leads}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Web, WhatsApp & AI Bot</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase">Hot Leads</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">High Intent</span>
          </div>
          <p className="text-3xl font-black text-rose-400 mt-3">{stats.hot_leads || 0}</p>
          <span className="text-[11px] text-rose-400/70 mt-1 block">Urgent Timeline / Quote Requested</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase">Warm Leads</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-3">{stats.warm_leads || 0}</p>
          <span className="text-[11px] text-amber-400/70 mt-1 block">Interested / Scope Clarifying</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Closed / Won</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-3">{stats.closed_leads}</p>
          <span className="text-[11px] text-emerald-400/70 mt-1 block">Signed Project Contracts</span>
        </div>
      </div>

      {/* Main Row: Recent Leads & Quick Founder Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Latest Incoming Leads</h3>
            <Link href="/admin/leads" className="text-xs text-cyan-400 hover:text-cyan-300">
              View All &rarr;
            </Link>
          </div>

          {stats.recent_leads?.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              No recent leads found. Test by submitting an enquiry on the website or via the AI chatbot!
            </p>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {stats.recent_leads.map((lead: any) => (
                <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
                    <p className="text-xs text-slate-400 truncate">{lead.email} • {lead.service_interest}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                      lead.status === 'NEW'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : lead.status === 'IN_PROGRESS'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Agency Information Card */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Agency Founder Hub</h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 uppercase block font-semibold">Founder</span>
              <p className="text-white font-medium text-sm mt-0.5">{AGENCY_METADATA.founder}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase block font-semibold">Contact Email</span>
              <a href={`mailto:${AGENCY_METADATA.email}`} className="text-cyan-400 hover:underline">
                {AGENCY_METADATA.email}
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <a
              href={AGENCY_METADATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-cyan-400" />
                <span>Founder LinkedIn</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={AGENCY_METADATA.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Office Location Map</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
