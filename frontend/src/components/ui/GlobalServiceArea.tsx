'use client';

import React, { useState } from 'react';
import { Globe2, Search, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { SERVICE_AREAS } from '@/lib/api';

export function GlobalServiceArea() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Americas', 'Europe', 'Asia', 'Africa', 'Middle East', 'Oceania'];

  const filteredCountries = SERVICE_AREAS.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedRegion === 'All') return matchesSearch;
    if (selectedRegion === 'Americas') {
      return matchesSearch && (country.region.includes('America') || country.region.includes('Caribbean'));
    }
    return matchesSearch && country.region.includes(selectedRegion);
  });

  return (
    <section className="py-20 relative overflow-hidden bg-slate-950/80 border-t border-b border-slate-900">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Worldwide Service Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Global <span className="text-gradient-cyan">Service Area</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Infotech proudly delivers modern, reliable IT solutions, custom software, and digital services to clients across 20 countries worldwide.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRegion === region
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Country Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-w-6xl mx-auto">
          {filteredCountries.map((country) => (
            <div
              key={country.name}
              className="group p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-300 flex items-center gap-3 backdrop-blur-md hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <span className="text-2xl select-none" role="img" aria-label={country.name}>
                {country.flag}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {country.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {country.region}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            No matching countries found for "{searchQuery}".
          </div>
        )}

        {/* Value Proposition Callout */}
        <div className="mt-14 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-indigo-950/40 border border-cyan-500/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Practical, Scalable & Affordable IT Solutions</span>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Whether you need a modern business website, custom Python software, intelligent automation, or ongoing digital support — Infotech brings international expertise and professional delivery to your doorstep.
          </p>
        </div>
      </div>
    </section>
  );
}
