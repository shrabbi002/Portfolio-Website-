'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Reveal from '@/components/shared/Reveal';

export default function ExperiencePage() {
    const [experiences, setExperiences] = useState(() => api.getCached('/experience') || []);
    const [loading, setLoading] = useState(() => !api.getCached('/experience'));

    useEffect(() => {
        api.get('/experience').then(setExperiences).catch(console.error).finally(() => setLoading(false));
    }, []);

    const getOrgIcon = (org) => {
        if (org.includes('Army')) return '🎖️';
        if (org.includes('Hospital') || org.includes('Medical')) return '🏥';
        if (org.includes('Pharmik') || org.includes('Laboratories') || org.includes('Drug')) return '🧪';
        if (org.includes('LAANTECH')) return '🤖';
        return '💼';
    };

    if (loading && experiences.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-dark-900">
            {/* Background ambient glow shapes */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none animate-float" />
            <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/3 via-transparent to-accent-pink/3 rounded-full blur-3xl pointer-events-none" />

            <div className="section-container relative z-10">
                {/* Section Header */}
                <Reveal direction="up" className="text-center mb-20">
                    <p className="text-primary-400 font-extrabold uppercase tracking-widest text-xs mb-3">My Journey</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight mb-4">
                        Professional <span className="gradient-text">Experience</span>
                    </h1>
                    <p className="section-subtitle mx-auto text-white/50 max-w-2xl text-base sm:text-lg">
                        A chronological record of my professional career, technical leadership, and engineering contributions.
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-cyan mx-auto rounded-full mt-6" />
                </Reveal>

                {/* Timeline container */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Glowing vertical line */}
                    <div className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-[3px] bg-gradient-to-b from-primary-500 via-accent-cyan to-accent-pink/30 -translate-x-1/2 pointer-events-none" />
                    
                    {/* Glow effect filter for the line */}
                    <div className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-[3px] bg-gradient-to-b from-primary-500 via-accent-cyan to-accent-pink/10 -translate-x-1/2 blur-[4px] pointer-events-none" />

                    {experiences.map((exp, i) => {
                        const orgIcon = getOrgIcon(exp.organization);
                        const isEven = i % 2 === 0;

                        return (
                            <div key={exp._id || i} className="relative mb-16 last:mb-0">
                                {/* Timeline Dot with Concentric Pulse circles */}
                                <div className="absolute left-6 lg:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                                    {/* Outer pulsing ring */}
                                    <div className="absolute w-8 h-8 rounded-full bg-primary-500/20 animate-ping pointer-events-none" />
                                    {/* Middle border ring */}
                                    <div className="w-6 h-6 rounded-full bg-dark-900 border-2 border-primary-500 flex items-center justify-center">
                                        {/* Inner colored circle */}
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
                                    </div>
                                </div>

                                <div className={`flex flex-col lg:flex-row gap-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                    {/* Left/Right Card Panel - spans half page */}
                                    <div className="flex-1 ml-16 lg:ml-0">
                                        <Reveal direction={isEven ? 'left' : 'right'} delay={0.1}>
                                            <div className="glass-card-hover p-8 relative overflow-hidden group">
                                                {/* Left Accent Bar */}
                                                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-primary-500 to-accent-cyan" />
                                                
                                                {/* Card Header */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            {orgIcon}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl sm:text-2xl font-heading font-black text-white group-hover:text-primary-400 transition-colors">{exp.role}</h3>
                                                            <p className="text-primary-300 font-bold text-sm tracking-wide mt-0.5">{exp.organization}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Work Duration Badge */}
                                                    <div className="flex-shrink-0">
                                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-black uppercase tracking-wider">
                                                            {exp.startDate} – {exp.endDate}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Responsibilities Section */}
                                                {exp.responsibilities?.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-white/80 text-sm font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                                            Key Responsibilities
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {exp.responsibilities.map((r, j) => (
                                                                <li key={j} className="text-white/60 text-sm flex items-start gap-3 leading-relaxed">
                                                                    <svg className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                    </svg>
                                                                    <span>{r}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Achievements Section */}
                                                {exp.achievements?.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                        <h4 className="text-accent-cyan text-sm font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                                                            Key Achievements
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {exp.achievements.map((a, j) => (
                                                                <li key={j} className="text-white/60 text-sm flex items-start gap-3 leading-relaxed">
                                                                    <svg className="w-4 h-4 text-accent-cyan mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.178-.367.72-.367.898 0l2.583 5.317 5.817.847c.41.06.574.566.278.857l-4.2 4.093 1 5.797c.07.41-.363.725-.727.53l-5.203-2.736-5.203 2.736c-.364.195-.798-.12-.727-.53l1-5.797-4.2-4.093c-.296-.29-.131-.797.279-.857l5.817-.847 2.583-5.317Z" />
                                                                    </svg>
                                                                    <span className="text-white/80 font-medium">{a}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </Reveal>
                                    </div>

                                    {/* Empty Half-Grid Column on larger screens to space the alternating sides */}
                                    <div className="hidden lg:block flex-1" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {experiences.length === 0 && !loading && (
                    <div className="text-center py-20 text-white/40">
                        <span className="text-5xl block mb-4">💼</span>
                        <p>Experience details coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
