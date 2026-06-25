'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminSkills() {
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ category: '', icon: '', skills: [] });
    const [msg, setMsg] = useState('');

    const load = () => api.get('/skills').then(setCategories).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => { setEditing('new'); setForm({ category: '', icon: '', skills: [{ name: '', proficiency: 80 }] }); };
    const startEdit = (cat) => { setEditing(cat._id); setForm({ ...cat }); };

    const addSkill = () => setForm({ ...form, skills: [...form.skills, { name: '', proficiency: 80 }] });
    const updateSkill = (i, field, val) => {
        const s = [...form.skills]; s[i] = { ...s[i], [field]: field === 'proficiency' ? parseInt(val) || 0 : val }; setForm({ ...form, skills: s });
    };
    const removeSkill = (i) => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });

    const save = async () => {
        try {
            if (editing === 'new') await api.post('/skills', form);
            else await api.put(`/skills/${editing}`, form);
            setEditing(null); load(); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
        } catch (e) { setMsg('Error: ' + e.message); }
    };

    const deleteCategory = async (id) => {
        if (!confirm('Delete this skill category?')) return;
        try { await api.delete(`/skills/${id}`); load(); } catch (e) { alert(e.message); }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Skills Manager</h1>
                <button onClick={startNew} className="btn-primary">+ Add Category</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <h3 className="font-heading font-semibold">{editing === 'new' ? 'New Category' : 'Edit Category'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">Category Name</label>
                            <input className="input-field" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Icon (emoji)</label>
                            <input className="input-field" value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="💻" /></div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-white/50 text-sm font-medium">Skills & Proficiencies</label>
                            <button onClick={addSkill} className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-bold rounded-lg border border-primary-500/10 hover:bg-primary-500/30 transition-all">+ Add Skill</button>
                        </div>
                        <div className="space-y-3">
                            {form.skills?.map((s, i) => (
                                <div key={i} className="flex gap-4 items-center bg-dark-900/60 p-4 rounded-2xl border border-white/5">
                                    <div className="flex-1">
                                        <label className="block text-white/40 text-[10px] uppercase font-bold mb-1">Skill Name</label>
                                        <input className="input-field py-2" placeholder="e.g. Java, Selenium" value={s.name || ''} onChange={e => updateSkill(i, 'name', e.target.value)} />
                                    </div>
                                    <div className="w-48 sm:w-64">
                                        <label className="block text-white/40 text-[10px] uppercase font-bold mb-1">Proficiency Level</label>
                                        <div className="flex items-center gap-3">
                                            <input type="range" min={0} max={100} className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500" value={s.proficiency || 0} onChange={e => updateSkill(i, 'proficiency', e.target.value)} />
                                            <span className="text-sm font-bold text-primary-400 w-12 text-right">{s.proficiency || 0}%</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300 self-end mb-2.5 p-1.5 hover:bg-red-500/10 rounded-lg transition-all" title="Remove Skill">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={save} className="btn-primary">Save</button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {categories.map((cat, i) => (
                    <div key={cat._id || i} className="glass-card p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center border border-white/5">
                                    <span className="text-xl">{cat.icon || '⚡'}</span>
                                </div>
                                <div>
                                    <h3 className="font-heading font-extrabold text-lg text-white">{cat.category}</h3>
                                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider">{cat.skills?.length || 0} skills</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(cat)} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white transition-all">Edit</button>
                                <button onClick={() => deleteCategory(cat._id)} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-all">Delete</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {cat.skills?.map((s, j) => (
                                <div key={j} className="bg-dark-900/40 p-4 rounded-2xl border border-white/5 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-white/80">{s.name}</span>
                                        <span className="text-xs font-bold text-primary-400">{s.proficiency}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-dark-700/60 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan" style={{ width: `${s.proficiency}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
