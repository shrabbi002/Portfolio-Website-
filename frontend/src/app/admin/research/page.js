'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminResearch() {
    const [pubs, setPubs] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', journal: '', year: '', doi: '', abstract: '', type: 'journal', authors: '', url: '' });
    const [msg, setMsg] = useState('');

    const load = () => api.get('/publications').then(setPubs).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => { setEditing('new'); setForm({ title: '', journal: '', year: new Date().getFullYear(), doi: '', abstract: '', type: 'journal', authors: '', url: '' }); };
    const startEdit = (p) => { setEditing(p._id); setForm({ ...p }); };

    const save = async () => {
        try {
            if (editing === 'new') await api.post('/publications', form);
            else await api.put(`/publications/${editing}`, form);
            setEditing(null); load(); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
        } catch (e) { setMsg('Error: ' + e.message); }
    };

    const deletePub = async (id) => {
        if (!confirm('Delete this publication?')) return;
        try { await api.delete(`/publications/${id}`); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Research Manager</h1>
                <button onClick={startNew} className="btn-primary">+ Add Publication</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <h3 className="font-heading font-semibold">{editing === 'new' ? 'New Publication' : 'Edit Publication'}</h3>
                    <div><label className="block text-white/50 text-sm mb-1">Title</label>
                        <input className="input-field" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">Journal / Conference</label>
                            <input className="input-field" value={form.journal || ''} onChange={e => setForm({ ...form, journal: e.target.value })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Year</label>
                            <input type="number" className="input-field" value={form.year || ''} onChange={e => setForm({ ...form, year: parseInt(e.target.value) || '' })} /></div>
                    </div>
                    <div><label className="block text-white/50 text-sm mb-1">Authors</label>
                        <input className="input-field" value={form.authors || ''} onChange={e => setForm({ ...form, authors: e.target.value })} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Type</label>
                        <select className="input-field" value={form.type || 'journal'} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="journal">Journal</option><option value="conference">Conference</option><option value="ongoing">Ongoing</option>
                        </select></div>
                    <div><label className="block text-white/50 text-sm mb-1">DOI</label>
                        <input className="input-field" value={form.doi || ''} onChange={e => setForm({ ...form, doi: e.target.value })} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Abstract</label>
                        <textarea className="input-field" rows={4} value={form.abstract || ''} onChange={e => setForm({ ...form, abstract: e.target.value })} /></div>
                    <div className="flex gap-3">
                        <button onClick={save} className="btn-primary">Save</button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {pubs.map((p, i) => (
                    <div key={p._id || i} className="glass-card p-5 flex justify-between items-start">
                        <div>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${p.type === 'journal' ? 'bg-primary-500/20 text-primary-300' :
                                    p.type === 'conference' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-accent-pink/20 text-accent-pink'
                                }`}>{p.type}</span>
                            <h3 className="font-semibold mt-2">{p.title}</h3>
                            <p className="text-white/40 text-sm">{p.journal} · {p.year}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => startEdit(p)} className="text-primary-400 hover:underline text-sm">Edit</button>
                            <button onClick={() => deletePub(p._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
