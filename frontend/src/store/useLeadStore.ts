import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  budget?: string;
  timeline?: string;
  requirements?: string[];
  message: string;
  status: string;
  lead_tier?: string; // HOT, WARM, COLD
  qualification_score?: number;
  handoff_requested?: boolean;
  preferred_channel?: string;
  language?: string;
  source: string;
  notes?: string;
  created_at: string;
}

interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  filter: string;
  tierFilter: string;
  setFilter: (status: string) => void;
  setTierFilter: (tier: string) => void;
  fetchLeads: (status?: string, tier?: string) => Promise<void>;
  updateStatus: (id: number, status: string, lead_tier?: string) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  isLoading: false,
  filter: 'ALL',
  tierFilter: 'ALL',

  setFilter: (filter) => {
    set({ filter });
    const status = filter === 'ALL' ? undefined : filter;
    const tier = get().tierFilter === 'ALL' ? undefined : get().tierFilter;
    get().fetchLeads(status, tier);
  },

  setTierFilter: (tierFilter) => {
    set({ tierFilter });
    const status = get().filter === 'ALL' ? undefined : get().filter;
    const tier = tierFilter === 'ALL' ? undefined : tierFilter;
    get().fetchLeads(status, tier);
  },

  fetchLeads: async (status, tier) => {
    set({ isLoading: true });
    try {
      const data = await api.admin.getLeads(status, tier);
      set({ leads: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id, status, lead_tier) => {
    try {
      const payload: any = { status };
      if (lead_tier) payload.lead_tier = lead_tier;
      const updated = await api.admin.updateLead(id, payload);
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? { ...l, status: updated.status, lead_tier: updated.lead_tier } : l))
      }));
    } catch (err) {
      console.error('Failed to update lead', err);
    }
  },

  deleteLead: async (id) => {
    try {
      await api.admin.deleteLead(id);
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete lead', err);
    }
  }
}));
