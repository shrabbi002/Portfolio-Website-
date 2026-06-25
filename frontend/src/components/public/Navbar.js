'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/Logo';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Skills', href: '/skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Research', href: '/research' },
    { name: 'Experience', href: '/experience' },
    { name: 'Blog', href: '/blog' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                setScrollProgress((window.scrollY / totalScroll) * 100);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    if (pathname?.startsWith('/admin')) return null;

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled ? 'bg-dark-900/90 backdrop-blur-xl shadow-lg border-b border-white/5' : 'bg-transparent'
            }`}>
                {/* Scroll progress bar */}
                <div className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-primary-500 via-primary-600 to-accent-cyan transition-all duration-100 ease-out" 
                     style={{ width: `${scrollProgress}%` }} />

                <div className="section-container">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
                            <div className="transition-transform duration-700 group-hover:rotate-[360deg]">
                                <Logo size={36} />
                            </div>
                            <span className="font-heading font-black text-xs sm:text-sm lg:text-base text-white tracking-wider uppercase hidden xs:block truncate max-w-[180px] sm:max-w-none group-hover:text-primary-400 transition-colors duration-300">
                                MD SAKHAWAT HOSSAIN RABBI
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href}
                                        className={`relative px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 group ${
                                            isActive
                                                ? 'text-primary-400'
                                                : 'text-white/60 hover:text-white'
                                        }`}>
                                        {link.name}
                                        <span className={`absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-primary-400 to-accent-cyan rounded-full transition-transform duration-300 origin-left ${
                                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile hamburger toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            <div className="flex flex-col gap-1.5">
                                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Slide-down Menu */}
            <div className={`fixed top-16 left-0 right-0 z-40 lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="section-container pb-4">
                    <div className="glass-card-premium p-3 space-y-1 border border-white/10">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                                        isActive
                                            ? 'text-primary-400 bg-primary-500/10'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
