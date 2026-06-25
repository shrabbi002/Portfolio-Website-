'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Logo from '@/components/shared/Logo';

export default function Footer() {
    const [contact, setContact] = useState(() => api.getCached('/contact'));

    useEffect(() => {
        api.get('/contact').then(setContact).catch(console.error);
    }, []);

    const socials = [
        {
            name: 'LinkedIn', href: contact?.linkedin,
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
        },
        {
            name: 'GitHub', href: contact?.github,
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
        },
        {
            name: 'Google Scholar', href: contact?.scholar,
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" /></svg>,
        },
    ].filter(s => s.href);

    return (
        <footer className="bg-dark-800/50 border-t border-white/5">
            <div className="section-container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <Logo size={40} />
                            <span className="font-heading font-bold text-lg">MD SAKHAWAT HOSSAIN RABBI</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed max-w-md">
                            Software QA Engineer | System Analyst | Data Analyst | Researcher. Building innovative solutions through technology and research.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {['About', 'Projects', 'Research', 'Blog', 'Skills', 'Contact'].map((item) => (
                                <Link key={item} href={`/${item.toLowerCase()}`}
                                    className="text-white/50 text-sm hover:text-primary-400 transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Connect</h4>
                        <div className="flex gap-3 mb-4">
                            {socials.map((social) => (
                                <a key={social.name} href={social.href} rel="noopener noreferrer"
                                    className="w-10 h-10 glass-card flex items-center justify-center text-white/60
                           hover:text-white hover:border-primary-500/30 transition-all hover:shadow-glow hover:scale-110"
                                    title={social.name}>
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {contact?.email && (
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-white/50 text-sm hover:text-primary-400 transition-colors">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                                    {contact.email}
                                </a>
                            )}
                            {contact?.phone && (
                                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-white/50 text-sm hover:text-primary-400 transition-colors">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                                    {contact.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
                    <p className="text-white/30 text-sm">Built with Next.js by MD SAKHAWAT HOSSAIN RABBI</p>
                </div>
            </div>
        </footer>
    );
}
