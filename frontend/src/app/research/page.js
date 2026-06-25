'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ResearchPage() {
    const [publications, setPublications] = useState(() => api.getCached('/publications') || []);
    const [activeType, setActiveType] = useState('All');
    const [loading, setLoading] = useState(() => !api.getCached('/publications'));

    useEffect(() => {
        api.get('/publications').then(setPublications).catch(console.error).finally(() => setLoading(false));
    }, []);

    const types = ['All', 'journal', 'conference', 'ongoing'];
    const filtered = activeType === 'All' ? publications : publications.filter(p => p.type === activeType);

    if (loading && publications.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="pt-24 section-padding">
            <div className="section-container">
                <div className="text-center mb-16 animate-fadeInUp">
                    <p className="text-primary-400 font-medium mb-2 uppercase tracking-wider text-sm">Academic Work</p>
                    <h1 className="section-title">Research & Publications</h1>
                    <p className="section-subtitle mx-auto">Contributing to knowledge through research and academic publishing</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {types.map((type) => (
                        <button key={type} onClick={() => setActiveType(type)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${activeType === type
                                ? 'bg-primary-500 text-white shadow-glow'
                                : 'bg-dark-800/50 text-white/50 hover:text-white hover:bg-dark-700/50'
                                }`}>
                            {type}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {filtered.map((pub, i) => {
                        const typeConfig = {
                            journal: { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-300', glow: 'hover:shadow-violet-500/10', icon: '📄' },
                            conference: { gradient: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', glow: 'hover:shadow-cyan-500/10', icon: '🎤' },
                            ongoing: { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-300', glow: 'hover:shadow-rose-500/10', icon: '🔬' },
                        };
                        const cfg = typeConfig[pub.type] || typeConfig.journal;

                        return (
                            <div key={pub._id || i}
                                className={`group relative overflow-hidden rounded-2xl border ${cfg.border} bg-dark-800/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl ${cfg.glow}`}
                                style={{ animationDelay: `${i * 100}ms` }}>
                                {/* Left accent bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${cfg.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                <div className="pl-8 pr-6 py-6 lg:py-8 flex flex-col lg:flex-row gap-6">
                                    {/* Journal Logo */}
                                    <div className="flex-shrink-0 flex lg:flex-col items-center lg:items-start gap-4 lg:gap-3">
                                        <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br ${cfg.gradient} p-[2px] group-hover:scale-105 transition-transform duration-300`}>
                                            <div className="w-full h-full rounded-2xl bg-dark-800 flex flex-col items-center justify-center gap-1">
                                                <span className="text-3xl lg:text-4xl">{cfg.icon}</span>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>{pub.type}</span>
                                            </div>
                                        </div>
                                        {pub.year && (
                                            <span className={`text-xs font-semibold ${cfg.text} lg:text-center lg:w-full`}>{pub.year}</span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Header row */}
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                                                <span>{cfg.icon}</span> {pub.type}
                                            </span>
                                            {pub.year && (
                                                <span className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs font-medium">
                                                    📅 {pub.year}
                                                </span>
                                            )}
                                            {pub.status && (
                                                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium capitalize">
                                                    {pub.status}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg lg:text-xl font-heading font-bold mb-3 leading-snug group-hover:text-white transition-colors">
                                            {pub.title}
                                        </h3>

                                        {/* Journal / Venue */}
                                        {pub.journal && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${cfg.gradient}`} />
                                                <p className={`text-sm font-medium ${cfg.text}`}>{pub.journal}</p>
                                                {pub.impactFactor && (
                                                    <span className="text-xs text-white/30 ml-1">IF: {pub.impactFactor}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Authors */}
                                        {pub.authors && (
                                            <p className="text-white/40 text-sm mb-4 leading-relaxed">
                                                <span className="text-white/20 mr-1">👥</span> {pub.authors}
                                            </p>
                                        )}

                                        {/* Abstract */}
                                        {pub.abstract && (
                                            <div className="mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                <p className="text-white/50 text-sm leading-relaxed">{pub.abstract}</p>
                                            </div>
                                        )}

                                        {/* Keywords */}
                                        {pub.keywords?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {pub.keywords.map((kw, j) => (
                                                    <span key={j} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">
                                                        #{kw}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* DOI / Links */}
                                        {pub.doi && (
                                            <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${cfg.bg} ${cfg.text} text-sm font-medium transition-all duration-300 hover:scale-105 hover:gap-3 group/link`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                View Publication
                                                <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                                            </a>
                                        )}
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cfg.gradient} opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && !loading && (
                    <div className="text-center py-20 text-white/40">
                        <span className="text-5xl block mb-4">📚</span>
                        <p>No publications found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
