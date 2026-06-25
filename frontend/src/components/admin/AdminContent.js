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

export default function AdminContent({ children }) {
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

    if (pathname === '/admin/login') return children;
    if (checking) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const handleLogout = () => { api.logout(); router.push('/admin/login'); };

    return (
        <div className="min-h-screen bg-dark-900 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/5
                          transform transition-transform duration-300 lg:translate-x-0
                          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-white/5">
                        <Link href="/admin" className="flex items-center gap-3">
                            <Logo size={38} />
                            <div>
                                <p className="font-heading font-bold text-sm">Admin Panel</p>
                                <p className="text-white/40 text-xs">{user?.username}</p>
                            </div>
                        </Link>
                    </div>
                    <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${pathname === item.href
                                    ? 'bg-primary-500/20 text-primary-400'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}>
                                <span className="text-base w-6 text-center">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-white/5 space-y-0.5">
                        <Link href="/" target="_blank"
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
                            <span className="text-base w-6 text-center">🌐</span> View Site
                        </Link>
                        <button onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full">
                            <span className="text-base w-6 text-center">🚪</span> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main content */}
            <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                <header className="sticky top-0 z-30 h-14 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 flex items-center px-6 lg:px-10">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="font-heading font-semibold text-lg">
                        {menuItems.find(m => m.href === pathname)?.name || 'Admin'}
                    </h2>
                </header>
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
