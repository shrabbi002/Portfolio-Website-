'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import MonthYearPicker from '@/components/admin/MonthYearPicker';

export default function AdminExperience() {
    const [exps, setExps] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ organization: '', role: '', startDate: '', endDate: 'Present', responsibilities: [], achievements: [] });
    const [msg, setMsg] = useState('');

    const load = () => api.get('/experience').then(setExps).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => { setEditing('new'); setForm({ organization: '', role: '', startDate: '', endDate: 'Present', responsibilities: [''], achievements: [''] }); };
    const startEdit = (e) => { setEditing(e._id); setForm({ ...e, responsibilities: e.responsibilities?.length ? e.responsibilities : [''], achievements: e.achievements?.length ? e.achievements : [''] }); };

    const updateList = (field, i, val) => {
        const list = [...form[field]]; list[i] = val; setForm({ ...form, [field]: list });
    };
    const addToList = (field) => setForm({ ...form, [field]: [...form[field], ''] });
    const removeFromList = (field, i) => setForm({ ...form, [field]: form[field].filter((_, idx) => idx !== i) });

    const save = async () => {
        const clean = { ...form, responsibilities: form.responsibilities.filter(r => r.trim()), achievements: form.achievements.filter(a => a.trim()) };
        try {
            if (editing === 'new') await api.post('/experience', clean);
            else await api.put(`/experience/${editing}`, clean);
            setEditing(null); load(); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
        } catch (e) { setMsg('Error: ' + e.message); }
    };

    const deleteExp = async (id) => {
        if (!confirm('Delete this experience?')) return;
        try { await api.delete(`/experience/${id}`); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Experience Manager</h1>
                <button onClick={startNew} className="btn-primary">+ Add Experience</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <h3 className="font-heading font-semibold">{editing === 'new' ? 'New Experience' : 'Edit Experience'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">Organization</label>
                            <input className="input-field" value={form.organization || ''} onChange={e => setForm({ ...form, organization: e.target.value })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Role</label>
                            <input className="input-field" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-1">Start Date</label>
                            <MonthYearPicker
                                value={form.startDate}
                                onChange={(val) => setForm({ ...form, startDate: val })}
                                placeholder="Select start date"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1">End Date</label>
                            {form.endDate === 'Present' ? (
                                <div className="input-field w-full flex items-center justify-between bg-emerald-500/5 border-emerald-500/20">
                                    <span className="text-emerald-400 font-medium text-sm">Present (Current)</span>
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                </div>
                            ) : (
                                <MonthYearPicker
                                    value={form.endDate}
                                    onChange={(val) => setForm({ ...form, endDate: val })}
                                    placeholder="Select end date"
                                />
                            )}
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${form.endDate === 'Present' ? 'bg-emerald-500' : 'bg-dark-600'}`}
                                    onClick={() => setForm({ ...form, endDate: form.endDate === 'Present' ? '' : 'Present' })}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${form.endDate === 'Present' ? 'left-[18px]' : 'left-0.5'}`} />
                                </div>
                                <span className="text-white/50 text-xs">Currently working here</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-white/50 text-sm">Responsibilities</label>
                            <button onClick={() => addToList('responsibilities')} className="text-primary-400 text-sm hover:underline">+ Add</button>
                        </div>
                        {form.responsibilities?.map((r, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input className="input-field flex-1" value={r} onChange={e => updateList('responsibilities', i, e.target.value)} />
                                <button onClick={() => removeFromList('responsibilities', i)} className="text-red-400">✕</button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-white/50 text-sm">Achievements</label>
                            <button onClick={() => addToList('achievements')} className="text-primary-400 text-sm hover:underline">+ Add</button>
                        </div>
                        {form.achievements?.map((a, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input className="input-field flex-1" value={a} onChange={e => updateList('achievements', i, e.target.value)} />
                                <button onClick={() => removeFromList('achievements', i)} className="text-red-400">✕</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={save} className="btn-primary">Save</button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {exps.map((e, i) => (
                    <div key={e._id || i} className="glass-card p-5 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{e.role}</h3>
                            <p className="text-white/40 text-sm">{e.organization} · {e.startDate} - {e.endDate}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(e)} className="text-primary-400 hover:underline text-sm">Edit</button>
                            <button onClick={() => deleteExp(e._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
