'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Reveal from '@/components/shared/Reveal';

const categoryIcons = {
    'All': '🌐', 'AI': '🤖', 'Web Development': '💻', 'Research': '🔬',
    'Enterprise Systems': '🏢', 'Other': '📦',
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState(() => api.getCached('/projects') || []);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(() => !api.getCached('/projects'));
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        api.get('/projects').then(setProjects).catch(console.error).finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
    const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

    if (loading && projects.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="pt-24 section-padding bg-dark-900 min-h-screen">
            <div className="section-container">
                {/* ═══ HEADER ═══ */}
                <div className="text-center mb-16 animate-fadeInUp">
                    <p className="text-primary-400 font-extrabold uppercase tracking-widest text-xs mb-2">My Work</p>
                    <h1 className="section-title">Projects Portfolio</h1>
                    <p className="section-subtitle mx-auto">
                        A collection of projects showcasing practical implementations across AI, web development, and enterprise solutions
                    </p>
                    {/* Stats bar */}
                    <div className="flex justify-center gap-8 mt-8">
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black text-white">{projects.length}</p>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Total Projects</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black text-primary-400">{projects.filter(p => p.featured).length}</p>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Featured</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-black text-accent-cyan">{new Set(projects.flatMap(p => p.technologies || [])).size}</p>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Technologies</p>
                        </div>
                    </div>
                </div>

                {/* ═══ CATEGORY FILTERS ═══ */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat
                                ? 'bg-gradient-to-r from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/25 scale-105 border border-primary-500/10'
                                : 'bg-dark-800/60 text-white/50 hover:text-white hover:bg-dark-700/60 border border-white/5 hover:border-white/10'
                                }`}>
                            <span className="group-hover:scale-110 transition-transform">{categoryIcons[cat] || '📁'}</span>
                            {cat}
                            {activeCategory === cat && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px] font-black">
                                    {filtered.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ═══ PROJECTS GRID ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((project, i) => {
                        const themes = [
                            { bg: 'from-[#1a1040] via-[#2d1b69] to-[#1a1040]', border: 'border-purple-500/15 hover:border-purple-400/40', accent: '#a855f7' },
                            { bg: 'from-[#0d2137] via-[#0e3a5e] to-[#0d2137]', border: 'border-sky-500/15 hover:border-sky-400/40', accent: '#38bdf8' },
                            { bg: 'from-[#1a0f0f] via-[#3b1520] to-[#1a0f0f]', border: 'border-rose-500/15 hover:border-rose-400/40', accent: '#fb7185' },
                            { bg: 'from-[#0a1f1a] via-[#0f3d2e] to-[#0a1f1a]', border: 'border-emerald-500/15 hover:border-emerald-400/40', accent: '#34d399' },
                            { bg: 'from-[#1f1505] via-[#3d2a0a] to-[#1f1505]', border: 'border-amber-500/15 hover:border-amber-400/40', accent: '#fbbf24' },
                            { bg: 'from-[#0f1535] via-[#1e2a6e] to-[#0f1535]', border: 'border-blue-500/15 hover:border-blue-400/40', accent: '#60a5fa' },
                        ];
                        const svgIcons = [
                            <svg key="code" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>,
                            <svg key="globe" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                            <svg key="cpu" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" /></svg>,
                            <svg key="chart" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
                            <svg key="rocket" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>,
                            <svg key="stack" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0 4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0 4.179 2.25L12 22.5 2.25 17.25l4.179-2.25" /></svg>,
                        ];
                        const theme = themes[i % themes.length];

                        return (
                            <Reveal key={project._id || i} direction="up" delay={(i % 3) * 0.08} duration={0.6}>
                                <Link href={`/projects/${project._id}`}
                                    onMouseEnter={() => setHoveredId(project._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`group relative overflow-hidden rounded-3xl border ${theme.border} bg-dark-800/40 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between`}>

                                    {/* ── Image / Header area ── */}
                                    <div className={`relative h-56 bg-gradient-to-br ${theme.bg} overflow-hidden border-b border-white/5`}>
                                        {project.screenshots?.[0] ? (
                                            <img src={api.getFileUrl(project.screenshots[0])} alt={project.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center relative">
                                                {/* Decorative shapes */}
                                                <div className="absolute top-6 right-8 w-16 h-16 border border-white/[0.04] rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                                                <div className="absolute bottom-8 left-6 w-12 h-12 border border-white/[0.04] rounded-full group-hover:scale-150 transition-transform duration-700" />
                                                <div className="absolute top-12 left-12 w-4 h-4 bg-white/[0.03] rounded-full" />

                                                <div className="relative group-hover:scale-115 transition-transform duration-500" style={{ color: theme.accent }}>
                                                    {svgIcons[i % svgIcons.length]}
                                                </div>
                                                <span className="text-white/15 text-[10px] font-black uppercase tracking-[0.2em] mt-3">{project.category}</span>
                                            </div>
                                        )}

                                        {/* Hover overlay with links */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6 gap-4 z-10">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                                    Code
                                                </a>
                                            )}
                                            {project.demoUrl && (
                                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-500 transition-all duration-300 translate-y-4 group-hover:translate-y-0 delay-75">
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>

                                        {/* Featured badge */}
                                        {project.featured && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-dark-900 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        )}

                                        {/* Category badge */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="px-3 py-1 bg-dark-900/60 backdrop-blur-md text-white/80 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/10">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Content area ── */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-heading font-black text-lg mb-2 text-white group-hover:text-primary-400 transition-colors duration-300">
                                                {project.name}
                                            </h3>

                                            {project.role && (
                                                <p className="text-primary-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                                    {project.role}
                                                </p>
                                            )}

                                            <p className="text-white/50 text-xs sm:text-sm mb-5 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {project.technologies?.slice(0, 5).map((tech, j) => (
                                                <span key={j}
                                                    className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.05] text-white/50 text-[10px] font-semibold uppercase tracking-wider rounded-lg hover:bg-white/[0.08] hover:text-white/80 transition-colors cursor-default">
                                                    {tech}
                                                </span>
                                            ))}
                                            {(project.technologies?.length || 0) > 5 && (
                                                <span className="px-2.5 py-1 text-primary-400/60 text-[10px] font-bold uppercase tracking-wider">
                                                    +{project.technologies.length - 5} more
                                                </span>
                                            )}
                                        </div>

                                        {/* View Details CTA */}
                                        <div className="mt-5 pt-4 border-t border-white/5">
                                            <span className="inline-flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                                                View Details & Process
                                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom gradient line */}
                                    <div className={`h-1 bg-gradient-to-r ${theme.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>

                {/* ═══ EMPTY STATE ═══ */}
                {filtered.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-dark-800/50 flex items-center justify-center">
                            <span className="text-4xl animate-bounce">📂</span>
                        </div>
                        <h3 className="text-lg font-heading font-black mb-2 text-white/60">No projects found</h3>
                        <p className="text-white/30 text-xs">No projects in this category yet. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
