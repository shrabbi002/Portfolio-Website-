'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');

        const fetchStats = async () => {
            try {
                const [projects, skills, publications, blog, certs, experience, msgs, gallery] = await Promise.all([
                    api.get('/projects').catch(() => []),
                    api.get('/skills').catch(() => []),
                    api.get('/publications').catch(() => []),
                    api.get('/blog').catch(() => []),
                    api.get('/certifications').catch(() => []),
                    api.get('/experience').catch(() => []),
                    api.get('/contact/messages').catch(() => []),
                    api.get('/gallery').catch(() => []),
                ]);
                setStats({
                    projects: projects.length,
                    skills: skills.reduce((acc, s) => acc + (s.skills?.length || 0), 0),
                    skillCategories: skills.length,
                    publications: publications.length,
                    blog: blog.length,
                    certifications: certs.length,
                    experience: experience.length,
                    messages: msgs.length,
                    unread: msgs.filter(m => !m.isRead).length,
                    gallery: gallery.length,
                });
                setMessages(msgs.slice(0, 5));
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Projects', value: stats.projects || 0, icon: '📁', color: 'from-violet-500 to-purple-600', link: '/admin/projects', desc: 'Total projects' },
        { label: 'Skills', value: stats.skills || 0, icon: '💡', color: 'from-cyan-500 to-blue-600', link: '/admin/skills', desc: `${stats.skillCategories || 0} categories` },
        { label: 'Publications', value: stats.publications || 0, icon: '📚', color: 'from-emerald-500 to-teal-600', link: '/admin/research', desc: 'Research papers' },
        { label: 'Experience', value: stats.experience || 0, icon: '💼', color: 'from-orange-500 to-amber-600', link: '/admin/experience', desc: 'Career roles' },
        { label: 'Blog Posts', value: stats.blog || 0, icon: '✍️', color: 'from-pink-500 to-rose-600', link: '/admin/blog', desc: 'Published articles' },
        { label: 'Certifications', value: stats.certifications || 0, icon: '🎓', color: 'from-indigo-500 to-blue-600', link: '/admin/certifications', desc: 'Achievements' },
        { label: 'Gallery Items', value: stats.gallery || 0, icon: '🖼️', color: 'from-teal-500 to-emerald-600', link: '/admin/gallery', desc: 'Photos & Videos' },
    ];

    const quickActions = [
        { label: 'Edit Hero', icon: '🏠', href: '/admin/hero', color: 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-300' },
        { label: 'Edit About', icon: '👤', href: '/admin/about', color: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300' },
        { label: 'Add Project', icon: '📁', href: '/admin/projects', color: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300' },
        { label: 'Add Gallery', icon: '🖼️', href: '/admin/gallery', color: 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300' },
        { label: 'Add Blog', icon: '✍️', href: '/admin/blog', color: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300' },
        { label: 'Add Skill', icon: '💡', href: '/admin/skills', color: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300' },
        { label: 'Messages', icon: '💬', href: '/admin/messages', color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300' },
        { label: 'Settings', icon: '⚙️', href: '/admin/settings', color: 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-300' },
        { label: 'View Site', icon: '🌐', href: '/', color: 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300', external: true },
    ];

    const contentHealth = [
        { label: 'Hero Section', done: true, href: '/admin/hero' },
        { label: 'About Page', done: true, href: '/admin/about' },
        { label: 'Skills', done: (stats.skills || 0) > 0, href: '/admin/skills' },
        { label: 'Projects', done: (stats.projects || 0) > 0, href: '/admin/projects' },
        { label: 'Experience', done: (stats.experience || 0) > 0, href: '/admin/experience' },
        { label: 'Publications', done: (stats.publications || 0) > 0, href: '/admin/research' },
        { label: 'Blog Posts', done: (stats.blog || 0) > 0, href: '/admin/blog' },
        { label: 'Certifications', done: (stats.certifications || 0) > 0, href: '/admin/certifications' },
        { label: 'Gallery Section', done: (stats.gallery || 0) > 0, href: '/admin/gallery' },
        { label: 'Contact Info', done: true, href: '/admin/contact' },
    ];
    const completedCount = contentHealth.filter(c => c.done).length;
    const completionPercent = Math.round((completedCount / contentHealth.length) * 100);

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-32 rounded-2xl bg-dark-800/50" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-dark-800/50" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-slideFadeUp">
            {/* ═══ WELCOME BANNER ═══ */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/30 via-primary-500/20 to-accent-cyan/25 border border-primary-500/10 p-6 md:p-8 shadow-lg shadow-primary-950/20">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-cyan/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-black tracking-tight mb-2">
                            {greeting}, Rabbi! 👋
                        </h1>
                        <p className="text-white/60 text-sm md:text-base max-w-xl">
                            Welcome back to your portfolio management board. Here's a quick summary of your content metrics.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                        <Link href="/" target="_blank" className="btn-outline text-sm font-semibold uppercase tracking-wider px-4 py-2.5 bg-dark-900/40 hover:bg-dark-900/80">
                            🌐 View Site
                        </Link>
                        <Link href="/admin/hero" className="btn-primary text-sm font-semibold uppercase tracking-wider px-4 py-2.5 hover-lift shimmer-effect">
                            ✏️ Edit Hero
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══ STAT CARDS ═══ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((stat, i) => (
                    <Link key={i} href={stat.link}
                        className="glass-card-hover group relative overflow-hidden p-5 flex flex-col justify-between animate-scaleIn"
                        style={{ animationDelay: `${i * 80}ms` }}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                        <div className="relative z-10">
                            <div className="text-2xl mb-4 p-2 rounded-xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">{stat.icon}</div>
                            <p className="text-3xl font-heading font-black tracking-tight mb-1 group-hover:text-primary-300 transition-colors">{stat.value}</p>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-white/40 text-[10px] tracking-wide mt-1.5">{stat.desc}</p>
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                    </Link>
                ))}
            </div>

            {/* ═══ MIDDLE ROW: Quick Actions + Messages ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Messages Panel (unread badge) */}
                <div className="lg:col-span-2 glass-card p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-heading font-black uppercase tracking-wider flex items-center gap-2">
                                💬 Latest Messages
                                {(stats.unread || 0) > 0 && (
                                    <span className="relative flex h-5 w-5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white items-center justify-center text-[10px] font-black">
                                            {stats.unread}
                                        </span>
                                    </span>
                                )}
                            </h3>
                            <Link href="/admin/messages" className="text-primary-400 text-xs font-semibold uppercase tracking-wider hover:text-primary-300 transition-colors">View All →</Link>
                        </div>
                        {messages.length > 0 ? (
                            <div className="space-y-2.5">
                                {messages.map((msg, i) => (
                                    <div key={msg._id || i}
                                        className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 border border-transparent ${msg.isRead ? 'opacity-55' : 'bg-primary-500/5 border-primary-500/10 hover:border-primary-500/20'
                                            }`}>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-xs font-black flex-shrink-0 text-white shadow-sm shadow-primary-500/10">
                                            {msg.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="font-semibold text-xs text-white truncate">{msg.name}</p>
                                                <span className="text-white/30 text-[10px] font-medium flex-shrink-0">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {msg.subject && <p className="text-primary-400 text-[10px] font-semibold mt-0.5 truncate">{msg.subject}</p>}
                                            <p className="text-white/40 text-[11px] mt-0.5 truncate leading-normal">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-3 opacity-30">📭</div>
                                <p className="text-white/40 text-sm font-semibold">No messages yet</p>
                                <p className="text-white/20 text-xs mt-1">Messages from your visitors will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="lg:col-span-3 glass-card p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-heading font-black uppercase tracking-wider mb-4">⚡ Quick Actions</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {quickActions.map((action, i) => (
                                <Link key={i} href={action.href} target={action.external ? '_blank' : undefined}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10 ${action.color} group hover:scale-105`}>
                                    <span className="text-3xl group-hover:scale-115 transition-transform duration-300 drop-shadow-md">{action.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ BOTTOM ROW: Content Health + Portfolio Overview ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Health */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-heading font-black uppercase tracking-wider">📊 Completeness Score</h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-heading font-black ${completionPercent === 100 ? 'text-emerald-400' :
                                completionPercent >= 70 ? 'text-amber-400' : 'text-red-400'
                                }`}>{completionPercent}%</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-3 bg-dark-700/60 rounded-full overflow-hidden mb-6 p-0.5 border border-white/5">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${completionPercent === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                completionPercent >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                    'bg-gradient-to-r from-red-500 to-pink-500'
                                }`}
                            style={{ width: `${completionPercent}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {contentHealth.map((item, i) => (
                            <Link key={i} href={item.href}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${item.done
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : 'bg-dark-700 text-white/20'
                                        }`}>
                                        {item.done ? '✓' : '○'}
                                    </div>
                                    <span className={`text-xs font-semibold ${item.done ? 'text-white/80' : 'text-white/40'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                <span className="text-white/20 text-[10px] font-bold uppercase tracking-wider group-hover:text-primary-400 transition-colors">
                                    {item.done ? 'Edit →' : 'Add →'}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Content Distribution */}
                <div className="glass-card p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-heading font-black uppercase tracking-wider mb-6">📈 Distribution Index</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Skills', count: stats.skills || 0, max: 30, color: 'from-cyan-500 to-blue-500', icon: '💡' },
                                { label: 'Projects', count: stats.projects || 0, max: 20, color: 'from-violet-500 to-purple-500', icon: '📁' },
                                { label: 'Publications', count: stats.publications || 0, max: 15, color: 'from-emerald-500 to-teal-500', icon: '📚' },
                                { label: 'Experience', count: stats.experience || 0, max: 10, color: 'from-orange-500 to-amber-500', icon: '💼' },
                                { label: 'Blog Posts', count: stats.blog || 0, max: 20, color: 'from-pink-500 to-rose-500', icon: '✍️' },
                                { label: 'Certifications', count: stats.certifications || 0, max: 20, color: 'from-indigo-500 to-blue-500', icon: '🎓' },
                                { label: 'Gallery Items', count: stats.gallery || 0, max: 20, color: 'from-teal-500 to-emerald-500', icon: '🖼️' },
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-semibold text-white/60 flex items-center gap-2">
                                            <span>{item.icon}</span> {item.label}
                                        </span>
                                        <span className="text-xs font-bold text-white/80">{item.count}</span>
                                    </div>
                                    <div className="w-full h-2 bg-dark-700/60 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 group-hover:opacity-100 opacity-85`}
                                            style={{ width: `${Math.min((item.count / item.max) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-white/40">Total Database Nodes</span>
                            <span className="font-heading font-black text-xl text-primary-400">
                                {(stats.projects || 0) + (stats.skills || 0) + (stats.publications || 0) +
                                    (stats.blog || 0) + (stats.certifications || 0) + (stats.experience || 0) + (stats.gallery || 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
