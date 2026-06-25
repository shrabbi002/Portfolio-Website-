'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Reveal from '@/components/shared/Reveal';

const certThemes = {
    certification: { gradient: 'from-violet-500 to-purple-600', ring: '#a855f7', bg: 'bg-violet-500/10', border: 'border-violet-500/20 hover:border-violet-400/40', glow: 'shadow-violet-500/10', icon: '🎓', label: 'Certification' },
    award: { gradient: 'from-amber-500 to-orange-500', ring: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20 hover:border-amber-400/40', glow: 'shadow-amber-500/10', icon: '🏆', label: 'Award' },
    competition: { gradient: 'from-cyan-500 to-teal-500', ring: '#06b6d4', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20 hover:border-cyan-400/40', glow: 'shadow-cyan-500/10', icon: '🥇', label: 'Competition' },
};
const defaultTheme = certThemes.certification;

export default function CertificationsPage() {
    const [certs, setCerts] = useState(() => api.getCached('/certifications') || []);
    const [activeType, setActiveType] = useState('All');
    const [loading, setLoading] = useState(() => !api.getCached('/certifications'));

    useEffect(() => {
        api.get('/certifications').then(setCerts).catch(console.error).finally(() => setLoading(false));
    }, []);

    const types = ['All', 'certification', 'award', 'competition'];
    const filtered = activeType === 'All' ? certs : certs.filter(c => c.type === activeType);

    if (loading && certs.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="pt-24 section-padding bg-dark-900 min-h-screen relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-40 left-10 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/3 via-violet-500/3 to-accent-cyan/3 rounded-full blur-3xl pointer-events-none" />

            <div className="section-container relative">
                {/* ═══ HEADER ═══ */}
                <div className="text-center mb-16 animate-fadeInUp">
                    <p className="text-primary-400 font-extrabold uppercase tracking-widest text-xs mb-2">Credentials</p>
                    <h1 className="section-title">Certifications & Achievements</h1>
                    <p className="section-subtitle mx-auto mb-8">Professional credentials and recognition earned through continuous learning</p>

                    {/* Stats bar */}
                    <div className="inline-flex items-center gap-8 glass-card px-8 py-4">
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black gradient-text">{certs.length}</p>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Total</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black text-violet-400">{certs.filter(c => c.type === 'certification').length}</p>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Certifications</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black text-amber-400">{certs.filter(c => c.type === 'award').length}</p>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Awards</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black text-cyan-400">{certs.filter(c => c.type === 'competition').length}</p>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Competitions</p>
                        </div>
                    </div>
                </div>

                {/* ═══ FILTERS ═══ */}
                <div className="flex flex-wrap justify-center gap-3 mb-14">
                    {types.map((type) => {
                        const theme = certThemes[type] || defaultTheme;
                        const count = type === 'All' ? certs.length : certs.filter(c => c.type === type).length;
                        return (
                            <button key={type} onClick={() => setActiveType(type)}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeType === type
                                    ? 'bg-gradient-to-r ' + (type === 'All' ? 'from-primary-500 to-violet-600' : theme.gradient) + ' text-white shadow-lg scale-105'
                                    : 'bg-dark-800/60 text-white/50 hover:text-white hover:bg-dark-700/60 border border-white/5 hover:border-white/10'
                                    }`}>
                                <span className="group-hover:scale-110 transition-transform">{type === 'All' ? '🌐' : theme.icon}</span>
                                <span className="capitalize">{type === 'All' ? 'All' : theme.label}</span>
                                {activeType === type && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px] font-black">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ═══ CERTIFICATIONS GRID ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((cert, i) => {
                        const theme = certThemes[cert.type] || defaultTheme;
                        return (
                            <Reveal key={cert._id || i} direction="up" delay={(i % 3) * 0.08} duration={0.6}>
                                <div className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-dark-800/40 backdrop-blur-sm hover:shadow-2xl ${theme.glow} transition-all duration-500 hover:-translate-y-2 h-full flex flex-col`}>
                                    {/* Top gradient accent */}
                                    <div className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Header with icon */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="relative flex-shrink-0">
                                                <svg className="w-16 h-16 -rotate-90 drop-shadow-lg" viewBox="0 0 64 64">
                                                    <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                                                    <circle cx="32" cy="32" r="29" fill="none" stroke={theme.ring} strokeWidth="2.5"
                                                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 29} strokeDashoffset={0}
                                                        className="opacity-30 group-hover:opacity-100 transition-opacity duration-700"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{theme.icon}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 pt-1">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${theme.bg}`} style={{ color: theme.ring }}>
                                                    {theme.label}
                                                </span>
                                                <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-primary-400 transition-colors duration-300 leading-snug">
                                                    {cert.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Organization & year */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.ring }} />
                                            <p className="text-white/50 text-xs font-medium">{cert.organization}</p>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            {cert.year ? (
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.bg} border ${theme.border.split(' ')[0]}`} style={{ color: theme.ring }}>
                                                    {cert.year}
                                                </span>
                                            ) : <span />}

                                            <div className="flex items-center gap-4">
                                                {cert.certificateImage && (
                                                    <a href={api.getFileUrl(cert.certificateImage)}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-primary-400 text-[10px] font-bold uppercase tracking-wider hover:text-primary-300 transition-colors group/img">
                                                        View Certificate
                                                        <svg className="w-3.5 h-3.5 group-hover/img:translate-x-0.5 group-hover/img:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                                                    </a>
                                                )}
                                                {cert.certificateUrl && (
                                                    <a href={cert.certificateUrl}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-accent-cyan text-[10px] font-bold uppercase tracking-wider hover:text-cyan-300 transition-colors group/link">
                                                        Verify Online
                                                        <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover glow */}
                                    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl ${theme.gradient} rounded-full opacity-0 group-hover:opacity-[0.04] blur-3xl transition-opacity duration-700 pointer-events-none`} />
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                {/* ═══ EMPTY STATE ═══ */}
                {filtered.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-dark-800/50 flex items-center justify-center">
                            <span className="text-4xl animate-bounce">🎓</span>
                        </div>
                        <h3 className="text-lg font-heading font-black mb-2 text-white/60">No certifications found</h3>
                        <p className="text-white/30 text-xs">No certifications in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
