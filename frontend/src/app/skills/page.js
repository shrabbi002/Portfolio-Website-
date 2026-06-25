'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function SkillsPage() {
    const [skills, setSkills] = useState(() => api.getCached('/skills') || []);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(() => !api.getCached('/skills'));
    const [hoveredSkill, setHoveredSkill] = useState(null);

    useEffect(() => {
        api.get('/skills').then(setSkills).catch(console.error).finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...skills.map(s => s.category)];
    const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory);
    const totalSkills = skills.reduce((acc, s) => acc + (s.skills?.length || 0), 0);

    const categoryThemes = {
        'Software Development': { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500', border: 'border-violet-500/20', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg> },
        'Software Testing': { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500', border: 'border-emerald-500/20', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
        'Business Analysis': { gradient: 'from-sky-500 to-blue-600', bg: 'bg-sky-500', border: 'border-sky-500/20', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> },
        'Data Science / AI': { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-500', border: 'border-rose-500/20', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg> },
        'Tools & Platforms': { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-500', border: 'border-amber-500/20', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg> },
    };
    const defaultTheme = { gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-500', border: 'border-indigo-500/20', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg> };

    if (loading && skills.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="pt-24 section-padding">
            <div className="section-container">
                {/* ═══ HEADER ═══ */}
                <div className="text-center mb-16 animate-fadeInUp">
                    <p className="text-primary-400 font-medium mb-2 uppercase tracking-wider text-sm">What I Do</p>
                    <h1 className="section-title">Skills & Technologies</h1>
                    <p className="section-subtitle mx-auto">Technical competencies honed across multiple domains of software engineering</p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-8">
                        <div className="text-center">
                            <p className="text-2xl font-heading font-bold text-white">{skills.length}</p>
                            <p className="text-white/40 text-xs uppercase tracking-wider">Categories</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-bold text-primary-400">{totalSkills}</p>
                            <p className="text-white/40 text-xs uppercase tracking-wider">Total Skills</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-heading font-bold text-accent-cyan">
                                {totalSkills > 0 ? Math.round(skills.reduce((acc, s) => acc + (s.skills?.reduce((a, sk) => a + sk.proficiency, 0) || 0), 0) / totalSkills) : 0}%
                            </p>
                            <p className="text-white/40 text-xs uppercase tracking-wider">Avg Proficiency</p>
                        </div>
                    </div>
                </div>

                {/* ═══ CATEGORY FILTERS ═══ */}
                <div className="flex flex-wrap justify-center gap-3 mb-14">
                    {categories.map((cat) => {
                        const theme = categoryThemes[cat] || defaultTheme;
                        return (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-gradient-to-r ' + (cat === 'All' ? 'from-primary-500 to-violet-600' : theme.gradient) + ' text-white shadow-lg scale-105'
                                    : 'bg-dark-800/60 text-white/50 hover:text-white hover:bg-dark-700/60 border border-white/5 hover:border-white/10'
                                    }`}>
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* ═══ SKILL CATEGORIES GRID ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filtered.map((cat, i) => {
                        const theme = categoryThemes[cat.category] || defaultTheme;
                        const avgProf = cat.skills?.length > 0
                            ? Math.round(cat.skills.reduce((a, s) => a + s.proficiency, 0) / cat.skills.length)
                            : 0;

                        return (
                            <div key={cat._id || i}
                                className={`group relative overflow-hidden rounded-3xl border ${theme.border} bg-dark-800/30 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}
                                style={{ animationDelay: `${i * 150}ms` }}>

                                {/* Top accent bar */}
                                <div className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                {/* Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                                                <div className="w-full h-full rounded-2xl bg-dark-800 flex items-center justify-center text-white">
                                                    {theme.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-heading font-bold group-hover:text-white transition-colors">{cat.category}</h3>
                                                <p className="text-white/30 text-xs">{cat.skills?.length || 0} skills · Avg {avgProf}%</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-heading font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                                                {avgProf}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills list */}
                                <div className="px-6 pb-6 space-y-4">
                                    {cat.skills?.map((skill, j) => {
                                        const isHovered = hoveredSkill === `${i}-${j}`;
                                        return (
                                            <div key={j}
                                                className="group/skill relative"
                                                onMouseEnter={() => setHoveredSkill(`${i}-${j}`)}
                                                onMouseLeave={() => setHoveredSkill(null)}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${theme.bg} transition-all duration-300 ${isHovered ? 'scale-150' : ''}`} />
                                                        <span className={`text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/70'}`}>
                                                            {skill.name}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${isHovered
                                                            ? `bg-gradient-to-r ${theme.gradient} text-white`
                                                            : 'text-white/40'
                                                        }`}>
                                                        {skill.proficiency}%
                                                    </span>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="h-2 bg-dark-700/80 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-700 ${isHovered ? 'opacity-100 shadow-lg' : 'opacity-70'}`}
                                                        style={{
                                                            width: `${skill.proficiency}%`,
                                                            boxShadow: isHovered ? `0 0 12px ${theme.bg === 'bg-violet-500' ? '#a855f750' : theme.bg === 'bg-emerald-500' ? '#34d39950' : theme.bg === 'bg-sky-500' ? '#38bdf850' : theme.bg === 'bg-rose-500' ? '#fb718550' : '#fbbf2450'}` : 'none',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Corner decorative */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${theme.gradient} opacity-0 group-hover:opacity-[0.03] rounded-full blur-3xl transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
