'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminCertifications() {
    const [certs, setCerts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', organization: '', year: '', certificateUrl: '', certificateImage: '', type: 'certification' });
    const [msg, setMsg] = useState('');

    const load = () => api.get('/certifications').then(setCerts).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => { setEditing('new'); setForm({ title: '', organization: '', year: new Date().getFullYear(), certificateUrl: '', certificateImage: '', type: 'certification' }); };
    const startEdit = (c) => { setEditing(c._id); setForm({ certificateImage: '', certificateUrl: '', ...c }); };

    const uploadCert = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try { const res = await api.upload(file); setForm(prev => ({ ...prev, certificateImage: res.url })); } catch (e) { alert(e.message); }
    };

    const save = async () => {
        try {
            if (editing === 'new') await api.post('/certifications', form);
            else await api.put(`/certifications/${editing}`, form);
            setEditing(null); load(); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
        } catch (e) { setMsg('Error: ' + e.message); }
    };

    const deleteCert = async (id) => {
        if (!confirm('Delete this certification?')) return;
        try { await api.delete(`/certifications/${id}`); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Certifications Manager</h1>
                <button onClick={startNew} className="btn-primary">+ Add</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <h3 className="font-heading font-semibold">{editing === 'new' ? 'New' : 'Edit'} Certification</h3>
                    <div><label className="block text-white/50 text-sm mb-1">Title</label>
                        <input className="input-field" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">Organization</label>
                            <input className="input-field" value={form.organization || ''} onChange={e => setForm({ ...form, organization: e.target.value })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Year</label>
                            <input type="number" className="input-field" value={form.year || ''} onChange={e => setForm({ ...form, year: parseInt(e.target.value) || '' })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Type</label>
                            <select className="input-field" value={form.type || 'certification'} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="certification">Certification</option><option value="award">Award</option><option value="competition">Competition</option>
                            </select></div>
                    </div>
                    <div><label className="block text-white/50 text-sm mb-1">Certificate URL</label>
                        <input className="input-field" value={form.certificateUrl || ''} onChange={e => setForm({ ...form, certificateUrl: e.target.value })} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Certificate Image</label>
                        <input type="file" accept="image/*,application/pdf" onChange={uploadCert} className="text-sm text-white/50" />
                        {form.certificateImage && <img src={api.getFileUrl(form.certificateImage)} className="mt-1 h-16 rounded object-cover" alt="" />}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={save} className="btn-primary">Save</button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {certs.map((c, i) => (
                    <div key={c._id || i} className="glass-card p-5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.type === 'certification' ? '🎓' : c.type === 'award' ? '🏆' : '🥇'}</span>
                            <div>
                                <h3 className="font-semibold">{c.title}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs">
                                    <span className="text-white/40">{c.organization} · {c.year}</span>
                                    {c.certificateUrl && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase">🔗 Link</span>}
                                    {c.certificateImage && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">🖼️ Image</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(c)} className="text-primary-400 hover:underline text-sm">Edit</button>
                            <button onClick={() => deleteCert(c._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
