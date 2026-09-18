'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Mail, 
  MapPin, 
  Linkedin, 
  Instagram, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Clock, 
  Phone 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { api, AGENCY_METADATA } from '@/lib/api';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_interest: 'Website Development',
    budget: '$2,000 - $4,000',
    message: ''
  });

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        service_interest: serviceParam
      }));
    }
  }, [serviceParam]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await api.public.submitContact(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_interest: 'AI & Intelligent Automation',
        budget: '$3,000 - $6,000',
        message: ''
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to submit enquiry. You can reach out directly via email at ' + AGENCY_METADATA.email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" className="mb-4">Get In Touch</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Let's Engineer Your <span className="text-gradient-cyan">Vision</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Submit your project brief below or reach out directly to Founder Mohammad Shahabuddin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Enquiry Received!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for contacting Infotech Software. Mohammad Shahabuddin and our technical team will review your project brief and respond within 24 hours.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Brief
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Technologies"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Service Interest
                      </label>
                      <select
                        name="service_interest"
                        value={formData.service_interest}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Website Development">Website Development</option>
                        <option value="Software Development">Software Development</option>
                        <option value="Python Development">Python Development</option>
                        <option value="Mobile Application Development">Mobile Application Development (Flutter & iOS/Android)</option>
                        <option value="School Management Software">School Management Software (Admissions, Fees, Parent Portal)</option>
                        <option value="AI & Automation Solutions">AI & Automation Solutions</option>
                        <option value="Business Applications">Business Applications (CRM / ERP)</option>
                        <option value="Technical Support & Customized IT">Technical Support & Customized IT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Estimated Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>$2,000 - $4,000</option>
                        <option>$4,000 - $8,000</option>
                        <option>$8,000 - $15,000</option>
                        <option>$15,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Project Goals & Details *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Briefly describe your product goals, desired timeline, or technical requirements..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <span>Transmitting Brief...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Details & Maps Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-6">
              <h3 className="text-lg font-bold text-white">Direct Communication</h3>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block uppercase">Founder Direct Email</span>
                    <a href={`mailto:${AGENCY_METADATA.email}`} className="text-white hover:text-cyan-400 font-medium transition-colors">
                      {AGENCY_METADATA.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block uppercase">Response SLA</span>
                    <p className="text-white font-medium">Within 24 Hours on Weekdays</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500 uppercase block mb-3 font-semibold">Founder Socials</span>
                <div className="flex items-center gap-3">
                  <a
                    href={AGENCY_METADATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href={AGENCY_METADATA.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Location Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-cyan-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white">Office Location & Headquarters</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our team operates globally with verified physical operations. You can pinpoint our exact location on Google Maps:
              </p>
              
              <a
                href={AGENCY_METADATA.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        Infotech Software Office
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">Open in Google Maps App</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400 text-sm">Loading consultation portal...</div>}>
      <ContactFormInner />
    </Suspense>
  );
}
