'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mobileView, setMobileView] = useState('list'); // 'list' | 'detail'

    const load = () => api.get('/contact/messages').then(setMessages).catch(console.error);
    useEffect(() => { load(); }, []);

    const markRead = async (id) => {
        try { await api.put(`/contact/messages/${id}`); load(); } catch (e) { console.error(e); }
    };

    const deleteMsg = async (id) => {
        if (!confirm('Delete this message?')) return;
        try { await api.delete(`/contact/messages/${id}`); setSelected(null); setMobileView('list'); load(); } catch (e) { alert(e.message); }
    };

    const handleSelect = (msg) => {
        setSelected(msg);
        setMobileView('detail');
        if (!msg.isRead) markRead(msg._id);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-heading font-bold">Contact Messages</h1>
                <span className="text-white/40 text-sm">{messages.length} messages</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                {/* Message list — hidden on mobile when detail is shown */}
                <div className={`lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
                    {messages.length === 0 && (
                        <div className="glass-card p-8 text-center text-white/40">
                            <span className="text-3xl block mb-2">📭</span>
                            <p>No messages yet</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <button key={msg._id || i}
                            onClick={() => handleSelect(msg)}
                            className={`w-full text-left p-4 rounded-xl transition-all ${selected?._id === msg._id ? 'bg-primary-500/20 border border-primary-500/30' :
                                    msg.isRead ? 'bg-dark-800/30 hover:bg-dark-800/50' : 'bg-primary-500/10 border border-primary-500/20'
                                }`}>
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">{msg.name}</p>
                                    <p className="text-white/40 text-xs truncate">{msg.email}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {!msg.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                                    <span className="text-white/30 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {msg.subject && <p className="text-primary-300 text-xs mt-1 truncate">{msg.subject}</p>}
                        </button>
                    ))}
                </div>

                {/* Message detail — shown on mobile only when a message is selected */}
                <div className={`lg:col-span-3 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
                    {selected ? (
                        <div className="glass-card p-4 sm:p-6 space-y-4">
                            {/* Back button — mobile only */}
                            <button
                                onClick={() => setMobileView('list')}
                                className="lg:hidden flex items-center gap-2 text-white/50 hover:text-white text-sm mb-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to messages
                            </button>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="min-w-0">
                                    <h3 className="font-heading font-semibold text-base sm:text-lg">{selected.subject || 'No Subject'}</h3>
                                    <p className="text-white/50 text-sm mt-1">From: {selected.name} &lt;{selected.email}&gt;</p>
                                    <p className="text-white/30 text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => deleteMsg(selected._id)}
                                    className="self-start sm:self-auto text-red-400 hover:text-red-300 text-sm border border-red-400/30 hover:border-red-400/60 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
                                    Delete
                                </button>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-white/70 whitespace-pre-wrap leading-relaxed text-sm">{selected.message}</p>
                            </div>
                            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                                className="btn-primary inline-flex text-sm">Reply via Email</a>
                        </div>
                    ) : (
                        <div className="glass-card p-8 sm:p-12 text-center text-white/30">
                            <span className="text-4xl block mb-4">💬</span>
                            <p>Select a message to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
