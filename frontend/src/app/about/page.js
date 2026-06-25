'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Terminal from '@/components/shared/Terminal';
import Reveal from '@/components/shared/Reveal';

export default function AboutPage() {
    const [about, setAbout] = useState(() => api.getCached('/about'));
    const [loading, setLoading] = useState(() => !api.getCached('/about'));

    useEffect(() => {
        api.get('/about').then(setAbout).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading && !about) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-dark-900">
            {/* Ambient Background Glows */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: '-3s' }} />
            <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-accent-pink/3 rounded-full blur-3xl pointer-events-none animate-float" />

            <div className="section-container relative z-10">
                {/* Header Title Section */}
                <Reveal direction="up" className="text-center mb-20">
                    <p className="text-primary-400 font-extrabold uppercase tracking-widest text-xs mb-3">
                        Get to Know Me
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight mb-4">
                        About <span className="gradient-text">Me</span>
                    </h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-cyan mx-auto rounded-full" />
                </Reveal>

                {/* Main Content Grid: Left Photo/Terminal & Right Biography */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                    {/* Left Column (Photo & Terminal) - spans 5 cols */}
                    <div className="lg:col-span-5 space-y-8">
                        <Reveal direction="left">
                            <div className="relative w-full aspect-square max-w-[340px] md:max-w-[400px] mx-auto group">
                                {/* Outer rotating gradient ring */}
                                <div className="absolute -inset-3 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: 'conic-gradient(from 0deg, #6c5ce7, #00d4ff, #ff6b9d, #6c5ce7)',
                                        animation: 'spin 8s linear infinite',
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'exclude',
                                        WebkitMaskComposite: 'xor',
                                        padding: '3px',
                                    }} />

                                {/* Glowing Border */}
                                <div className="absolute -inset-1 rounded-[1.8rem] bg-gradient-to-br from-primary-500/20 via-transparent to-accent-cyan/20 animate-borderGlow" />

                                {/* Tilted Background Frames */}
                                <div className="absolute inset-3 rounded-3xl border border-primary-500/20 rotate-3 group-hover:rotate-6 transition-transform duration-700" />
                                <div className="absolute inset-2 rounded-3xl border border-accent-cyan/10 -rotate-2 group-hover:-rotate-5 transition-transform duration-700" />

                                {/* Main Photo Image */}
                                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden bg-dark-800/80 border border-white/10">
                                    {about?.image ? (
                                        <img src={api.getFileUrl(about.image)} alt="MD Sakhawat Hossain Rabbi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center relative">
                                            <div className="absolute top-6 right-8 w-14 h-14 border border-white/[0.04] rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                                            <div className="absolute bottom-8 left-6 w-10 h-10 border border-white/[0.04] rounded-full group-hover:scale-150 transition-transform duration-700" />
                                            <span className="text-8xl select-none filter drop-shadow-lg opacity-40 group-hover:scale-110 transition-transform duration-500">🧑‍💼</span>
                                        </div>
                                    )}
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Decorative corner borders */}
                                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary-400/50 rounded-tl-xl animate-borderGlow" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-accent-cyan/50 rounded-tr-xl animate-borderGlow" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-accent-cyan/50 rounded-bl-xl animate-borderGlow" style={{ animationDelay: '1s' }} />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary-400/50 rounded-br-xl animate-borderGlow" style={{ animationDelay: '1.5s' }} />
                            </div>
                        </Reveal>

                        <Reveal direction="up" delay={0.2}>
                            <Terminal />
                        </Reveal>
                    </div>

                    {/* Right Column (Biography & Philosophy) - spans 7 cols */}
                    <div className="lg:col-span-7 space-y-8">
                        {about?.biography && (
                            <Reveal direction="right">
                                <div className="glass-card-premium p-8 relative overflow-hidden group">
                                    {/* Top decorative gradient bar */}
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-pink" />
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-heading font-black gradient-text">Biography</h2>
                                    </div>

                                    <p className="text-white/70 leading-relaxed text-base sm:text-lg">
                                        {about.biography}
                                    </p>
                                </div>
                            </Reveal>
                        )}

                        {about?.philosophy && (
                            <Reveal direction="right" delay={0.1}>
                                <div className="glass-card p-8 border-l-4 border-primary-500 relative overflow-hidden group hover:border-accent-cyan transition-colors duration-500">
                                    {/* Large background quote marks */}
                                    <div className="absolute right-6 bottom-2 text-primary-500/5 text-9xl font-serif font-black select-none pointer-events-none">
                                        ”
                                    </div>
                                    <div className="absolute left-6 top-2 text-primary-500/5 text-9xl font-serif font-black select-none pointer-events-none">
                                        “
                                    </div>
                                    
                                    <p className="text-white/80 italic text-lg sm:text-xl leading-relaxed relative z-10">
                                        &ldquo;{about.philosophy}&rdquo;
                                    </p>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>

                {/* Subsections Grid: Career Journey, Education, Expertise, Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Sub-Grid: Career & Education */}
                    <div className="space-y-8">
                        {about?.careerJourney && (
                            <Reveal direction="up">
                                <div className="glass-card-hover p-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-cyan to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-white">Career Journey</h2>
                                    </div>
                                    
                                    <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                                        {about.careerJourney}
                                    </p>
                                </div>
                            </Reveal>
                        )}

                        {about?.education && (
                            <Reveal direction="up">
                                <div className="glass-card-hover p-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-pink to-primary-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-accent-pink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M22.25 9.312 12.117 19.445a.75.75 0 0 1-1.06 0L1 9.312" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-white">Education</h2>
                                    </div>
                                    
                                    {Array.isArray(about.education) ? (
                                        <div className="space-y-6">
                                            {about.education.map((edu, idx) => (
                                                <div key={idx} className="relative pl-6 border-l border-white/10 last:border-0 pb-1">
                                                    {/* Dot */}
                                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-pink border border-dark-900" />
                                                    
                                                    <h4 className="font-heading font-bold text-white text-base leading-snug">{edu.degree}</h4>
                                                    <p className="text-primary-300 text-xs mt-1 font-semibold">{edu.institution}</p>
                                                    <p className="text-white/40 text-[10px] font-bold mt-1 uppercase tracking-wider">{edu.duration}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                                            {about.education}
                                        </p>
                                    )}
                                </div>
                            </Reveal>
                        )}
                    </div>

                    {/* Right Sub-Grid: Expertise & Goals */}
                    <div className="space-y-8">
                        {about?.expertise?.length > 0 && (
                            <Reveal direction="up" delay={0.1}>
                                <div className="glass-card-hover p-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-white">Areas of Expertise</h2>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2.5">
                                        {about.expertise.map((e, i) => (
                                            <span key={i} className="px-4 py-2 bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/5 text-primary-200 hover:text-emerald-300 text-xs sm:text-sm font-semibold tracking-wider rounded-xl transition-all duration-300 cursor-default">
                                                {e}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {about?.goals && (
                            <Reveal direction="up" delay={0.1}>
                                <div className="glass-card-hover p-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-1.519 0-2.75-1.231-2.75-2.75s1.231-2.75 2.75-2.75c1.519 0 2.75 1.231 2.75 2.75s-1.231 2.75-2.75 2.75Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 16.5c-3.728 0-6.75-3.022-6.75-6.75s3.022-6.75 6.75-6.75 6.75 3.022 6.75 6.75-3.022 6.75-6.75 6.75Z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-white">Goals & Research</h2>
                                    </div>
                                    
                                    <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                                        {about.goals}
                                    </p>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

