'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Logo from '@/components/shared/Logo';

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Hero', href: '/admin/hero', icon: '🏠' },
    { name: 'About', href: '/admin/about', icon: '👤' },
    { name: 'Skills', href: '/admin/skills', icon: '💡' },
    { name: 'Projects', href: '/admin/projects', icon: '📁' },
    { name: 'Research', href: '/admin/research', icon: '📚' },
    { name: 'Experience', href: '/admin/experience', icon: '💼' },
    { name: 'Blog', href: '/admin/blog', icon: '✍️' },
    { name: 'Certifications', href: '/admin/certifications', icon: '🎓' },
    { name: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
    { name: 'Contact', href: '/admin/contact', icon: '📧' },
    { name: 'Messages', href: '/admin/messages', icon: '💬' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/admin/login') { setChecking(false); return; }
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
        if (!token) { router.push('/admin/login'); return; }
        api.get('/auth/me')
            .then(setUser)
            .catch(() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); })
            .finally(() => setChecking(false));
    }, [pathname, router]);

    // Close sidebar when route changes (mobile nav)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (pathname === '/admin/login') return children;
    if (checking) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const handleLogout = () => { api.logout(); router.push('/admin/login'); };

    return (
        <div className="min-h-screen bg-dark-900 flex">
            {/* Mobile overlay backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-dark-800/90 backdrop-blur-xl border-r border-white/5
                          transform transition-transform duration-300 ease-in-out lg:translate-x-0
                          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-dark-900/20">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="relative p-0.5 rounded-xl border border-white/10 group-hover:border-primary-500/50 group-hover:scale-105 transition-all duration-300">
                                <Logo size={36} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-heading font-extrabold text-sm tracking-tight text-white group-hover:text-primary-400 transition-colors">Admin Panel</p>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider truncate max-w-[120px]">{user?.username || 'Administrator'}</p>
                            </div>
                        </Link>
                        {/* Close button — mobile only */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white/50 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 overflow-y-auto space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 group overflow-hidden ${
                                        isActive
                                            ? 'bg-gradient-to-r from-primary-500/15 to-primary-500/5 text-primary-400 border border-primary-500/10'
                                            : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}>
                                    {isActive && (
                                        <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-gradient-to-b from-primary-400 to-accent-cyan rounded-r-md animate-scaleIn" />
                                    )}
                                    <span className={`text-base w-5 text-center flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t border-white/5 space-y-1 bg-dark-900/10">
                        <Link href="/" target="_blank"
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/5 transition-all">
                            <span className="text-base w-5 text-center">🌐</span> View Site
                        </Link>
                        <button onClick={handleLogout}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full text-left">
                            <span className="text-base w-5 text-center">🚪</span> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 min-h-screen flex flex-col bg-dark-900">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 h-16 bg-dark-900/80 backdrop-blur-lg border-b border-white/5 flex items-center px-4 sm:px-6 gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all flex-shrink-0 border border-white/5"
                        aria-label="Open navigation menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider truncate text-white">
                        <span className="mr-2">{menuItems.find(m => m.href === pathname)?.icon}</span>
                        {menuItems.find(m => m.href === pathname)?.name || 'Admin'}
                    </h2>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-slideFadeUp">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
