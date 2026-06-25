'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminContact() {
    const [data, setData] = useState({ email: '', phone: '', linkedin: '', github: '', scholar: '', location: '', cvFile: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => { api.get('/contact').then(setData).catch(console.error); }, []);

    const save = async () => {
        setSaving(true);
        try { await api.put('/contact', data); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000); }
        catch (e) { setMsg('Error: ' + e.message); }
        setSaving(false);
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const res = await api.upload(file);
            setData({ ...data, cvFile: res.url });
        } catch (e) { alert(e.message); }
        setUploading(false);
    };

    const uploadCV = (e) => handleFileUpload(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileUpload(e.dataTransfer.files[0]);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Contact Info</h1>
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            <div className="glass-card p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-white/50 text-sm mb-2">Email</label>
                        <input className="input-field" value={data.email || ''} onChange={e => setData({ ...data, email: e.target.value })} /></div>
                    <div><label className="block text-white/50 text-sm mb-2">Phone</label>
                        <input className="input-field" value={data.phone || ''} onChange={e => setData({ ...data, phone: e.target.value })} /></div>
                </div>
                <div><label className="block text-white/50 text-sm mb-2">LinkedIn URL</label>
                    <input className="input-field" value={data.linkedin || ''} onChange={e => setData({ ...data, linkedin: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">GitHub URL</label>
                    <input className="input-field" value={data.github || ''} onChange={e => setData({ ...data, github: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Google Scholar URL</label>
                    <input className="input-field" value={data.scholar || ''} onChange={e => setData({ ...data, scholar: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Location</label>
                    <input className="input-field" value={data.location || ''} onChange={e => setData({ ...data, location: e.target.value })} /></div>

                {/* Modern CV Upload Section */}
                <div>
                    <label className="block text-white/50 text-sm mb-3">CV / Resume File</label>

                    {data.cvFile ? (
                        /* ── File uploaded state ── */
                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">CV Uploaded Successfully</p>
                                <p className="text-xs text-emerald-400 mt-0.5">✓ Ready for download on your portfolio</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <a href={api.getFileUrl(data.cvFile)} target="_blank" rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white transition-all">
                                    Preview
                                </a>
                                <label className="px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 text-xs font-medium hover:bg-primary-500/30 transition-all cursor-pointer">
                                    Replace
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={uploadCV} className="hidden" />
                                </label>
                                <button onClick={() => setData({ ...data, cvFile: '' })}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ── Upload dropzone ── */
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center ${dragOver
                                    ? 'border-primary-400 bg-primary-500/10 scale-[1.02]'
                                    : 'border-white/10 hover:border-white/20 bg-dark-800/30'
                                }`}>
                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
                                    <p className="text-white/60 text-sm">Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? 'bg-primary-500/20 scale-110' : 'bg-white/5'
                                        }`}>
                                        <svg className={`w-8 h-8 transition-colors ${dragOver ? 'text-primary-400' : 'text-white/30'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <p className="text-white/60 text-sm mb-1">
                                        <label className="text-primary-400 font-medium cursor-pointer hover:underline">
                                            Click to upload
                                            <input type="file" accept=".pdf,.doc,.docx" onChange={uploadCV} className="hidden" />
                                        </label>
                                        {' '}or drag and drop
                                    </p>
                                    <p className="text-white/25 text-xs">PDF, DOC, or DOCX (max 10MB)</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
