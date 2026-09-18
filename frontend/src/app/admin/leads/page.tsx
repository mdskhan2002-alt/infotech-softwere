'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Trash2, 
  Mail, 
  Phone, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search, 
  MessageSquare,
  Flame,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useLeadStore, Lead } from '@/store/useLeadStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminLeadsPage() {
  const { 
    leads, 
    isLoading, 
    filter, 
    tierFilter, 
    setFilter, 
    setTierFilter, 
    fetchLeads, 
    updateStatus, 
    deleteLead 
  } = useLeadStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      (l.name || '').toLowerCase().includes(term) ||
      (l.email || '').toLowerCase().includes(term) ||
      (l.company || '').toLowerCase().includes(term) ||
      (l.service_interest || '').toLowerCase().includes(term) ||
      (l.lead_tier || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads & Enquiries CRM</h1>
          <p className="text-xs text-slate-400 mt-1">
            Qualify, segment (HOT / WARM / COLD), and follow up with incoming inquiries across Web, WhatsApp, and Voice AI.
          </p>
        </div>

        {/* Dual Filter Bars */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 uppercase px-2 font-semibold">Status:</span>
            {['ALL', 'NEW', 'IN_PROGRESS', 'CLOSED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filter === s
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Qualification Tier Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 uppercase px-2 font-semibold">Tier:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'HOT', label: '🔥 Hot' },
              { id: 'WARM', label: '⚡ Warm' },
              { id: 'COLD', label: '❄️ Cold' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  tierFilter === t.id
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search leads by client name, email, company, service, tier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
            Fetching latest enquiries from database...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No inquiries match the current filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Client & Contact</th>
                  <th className="px-5 py-4">Service & Budget</th>
                  <th className="px-5 py-4">Lead Tier</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Channel</th>
                  <th className="px-5 py-4">Received</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Client */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{lead.name}</span>
                          {lead.handoff_requested && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" title="Human Handoff Requested">
                              Handoff
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span>{lead.email}</span>
                          {lead.phone && <span>• {lead.phone}</span>}
                        </div>
                        {lead.company && (
                          <span className="text-[11px] text-cyan-400/80 mt-0.5 block">{lead.company}</span>
                        )}
                      </div>
                    </td>

                    {/* Service & Budget */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-200">{lead.service_interest || 'General Inquiry'}</p>
                        <span className="text-xs text-slate-400 font-mono">
                          {lead.budget || 'Custom Quote'} {lead.timeline ? `• ${lead.timeline}` : ''}
                        </span>
                      </div>
                    </td>

                    {/* Lead Tier */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                          (lead.lead_tier || 'HOT') === 'HOT'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : (lead.lead_tier || 'HOT') === 'WARM'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {lead.lead_tier || 'HOT'}
                        </span>
                        {lead.qualification_score && (
                          <span className="text-[10px] font-mono text-slate-500">{lead.qualification_score}%</span>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          lead.status === 'NEW'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : lead.status === 'IN_PROGRESS'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <option value="NEW" className="bg-slate-900 text-cyan-400">NEW</option>
                        <option value="IN_PROGRESS" className="bg-slate-900 text-indigo-400">IN PROGRESS</option>
                        <option value="CLOSED" className="bg-slate-900 text-emerald-400">CLOSED</option>
                      </select>
                    </td>

                    {/* Channel */}
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {lead.preferred_channel || lead.source || 'WEBSITE'}
                      </span>
                    </td>

                    {/* Received date */}
                    <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          Details
                        </button>

                        <a
                          href={`mailto:${lead.email}?subject=Regarding Your Project Proposal - Infotech Software`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-cyan-400 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Mohammad%20Shahabuddin%20from%20Infotech%20Software.%20Regarding%20your%20${encodeURIComponent(lead.service_interest || 'software')}%20enquiry:`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 text-emerald-400 transition-colors"
                            title="Open in WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Delete enquiry from ${lead.name}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message & Qualification Modal Preview */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedLead.name}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    (selectedLead.lead_tier || 'HOT') === 'HOT'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : (selectedLead.lead_tier || 'HOT') === 'WARM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {selectedLead.lead_tier || 'HOT'} LEAD
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{selectedLead.email} • {selectedLead.phone || 'No phone'} • {selectedLead.company || 'Direct Client'}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
                {selectedLead.service_interest}
              </span>
            </div>

            {/* Structured Requirements & Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 uppercase block font-semibold text-[10px]">Estimated Budget</span>
                <span className="text-white font-medium">{selectedLead.budget || 'Custom Scope'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 uppercase block font-semibold text-[10px]">Target Timeline</span>
                <span className="text-white font-medium">{selectedLead.timeline || 'Discuss on call'}</span>
              </div>
            </div>

            {selectedLead.requirements && selectedLead.requirements.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Identified Requirements / Modules:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.requirements.map((req, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Project Message / Requirements:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selectedLead.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=Regarding Your Project Proposal - Infotech Software`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>

                {selectedLead.phone && (
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLead.name)},%20this%20is%20Mohammad%20Shahabuddin%20from%20Infotech%20Software.%20I%20reviewed%20your%20${encodeURIComponent(selectedLead.service_interest || 'software')}%20requirements.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
