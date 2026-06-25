'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ContactPage() {
    const [contact, setContact] = useState(() => api.getCached('/contact'));
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(() => !api.getCached('/contact'));

    useEffect(() => {
        api.get('/contact').then(setContact).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await api.post('/contact/message', form);
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        } catch (err) {
            setStatus('error');
        }
    };

    if (loading && !contact) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const contactItems = [
        {
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>,
            label: 'Email', value: contact?.email, link: `mailto:${contact?.email}`,
            color: 'from-rose-500 to-orange-500',
        },
        {
            icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
            label: 'LinkedIn', value: 'LinkedIn Profile', link: contact?.linkedin,
            color: 'from-sky-500 to-blue-600',
        },
        {
            icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
            label: 'GitHub', value: 'GitHub Profile', link: contact?.github,
            color: 'from-violet-500 to-purple-600',
        },
        {
            icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" /></svg>,
            label: 'Google Scholar', value: 'Scholar Profile', link: contact?.scholar,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>,
            label: 'Phone', value: contact?.phone, link: `tel:${contact?.phone}`,
            color: 'from-amber-500 to-orange-500',
        },
        {
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>,
            label: 'Location', value: contact?.location,
            color: 'from-emerald-500 to-teal-500',
        },
    ].filter(item => item.value);

    return (
        <div className="pt-24 section-padding">
            <div className="section-container">
                <div className="text-center mb-16 animate-fadeInUp">
                    <p className="text-primary-400 font-medium mb-2 uppercase tracking-wider text-sm">Get in Touch</p>
                    <h1 className="section-title">Contact Me</h1>
                    <p className="section-subtitle mx-auto">Have a question or want to collaborate? Feel free to reach out!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6 animate-fadeInLeft">
                        {contactItems.map((item, i) => (
                            <div key={i} className="glass-card-hover p-4 flex items-center gap-4 group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-wider">{item.label}</p>
                                    {item.link ? (
                                        <a href={item.link} rel="noopener noreferrer"
                                            className="text-white hover:text-primary-400 transition-colors text-sm font-medium">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-white text-sm font-medium">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {contact?.cvFile && (
                            <a href={api.getFileUrl(contact.cvFile)} download className="btn-primary w-full justify-center">
                                📄 Download CV
                            </a>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3 animate-fadeInRight">
                        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/50 text-sm mb-2">Name *</label>
                                    <input type="text" required value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="input-field" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-white/50 text-sm mb-2">Email *</label>
                                    <input type="email" required value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="input-field" placeholder="Your email" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/50 text-sm mb-2">Subject</label>
                                <input type="text" value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="input-field" placeholder="Subject" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-sm mb-2">Message *</label>
                                <textarea required value={form.message} rows={5}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="input-field resize-none" placeholder="Your message..." />
                            </div>

                            {status === 'success' && (
                                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm">
                                    ✅ Message sent successfully! I&apos;ll get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                                    ❌ Failed to send message. Please try again.
                                </div>
                            )}

                            <button type="submit" disabled={status === 'sending'}
                                className="btn-primary w-full justify-center disabled:opacity-50">
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
