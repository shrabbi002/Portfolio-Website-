'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', technologies: [], role: '', category: 'Other', githubUrl: '', demoUrl: '', featured: false });
    const [techInput, setTechInput] = useState('');
    const [msg, setMsg] = useState('');

    const load = () => api.get('/projects').then(setProjects).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => { setEditing('new'); setForm({ name: '', description: '', technologies: [], role: '', category: 'Other', githubUrl: '', demoUrl: '', featured: false }); };
    const startEdit = (p) => { setEditing(p._id); setForm({ ...p }); };

    const addTech = () => { if (techInput.trim()) { setForm({ ...form, technologies: [...(form.technologies || []), techInput.trim()] }); setTechInput(''); } };

    const save = async () => {
        try {
            if (editing === 'new') await api.post('/projects', form);
            else await api.put(`/projects/${editing}`, form);
            setEditing(null); load(); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
        } catch (e) { setMsg('Error: ' + e.message); }
    };

    const deleteProject = async (id) => {
        if (!confirm('Delete this project?')) return;
        try { await api.delete(`/projects/${id}`); load(); } catch (e) { alert(e.message); }
    };

    const uploadScreenshot = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try { const res = await api.upload(file); setForm({ ...form, screenshots: [...(form.screenshots || []), res.url] }); } catch (e) { alert(e.message); }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Projects Manager</h1>
                <button onClick={startNew} className="btn-primary">+ Add Project</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <h3 className="font-heading font-semibold">{editing === 'new' ? 'New Project' : 'Edit Project'}</h3>
                    <div><label className="block text-white/50 text-sm mb-1">Name</label>
                        <input className="input-field" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Description</label>
                        <textarea className="input-field" rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">Role</label>
                            <input className="input-field" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Category</label>
                            <select className="input-field" value={form.category || 'Other'} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {['AI', 'Web Development', 'Research', 'Enterprise Systems', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">GitHub URL</label>
                            <input className="input-field" value={form.githubUrl || ''} onChange={e => setForm({ ...form, githubUrl: e.target.value })} /></div>
                        <div><label className="block text-white/50 text-sm mb-1">Demo URL</label>
                            <input className="input-field" value={form.demoUrl || ''} onChange={e => setForm({ ...form, demoUrl: e.target.value })} /></div>
                    </div>
                    <div><label className="block text-white/50 text-sm mb-1">Technologies</label>
                        <div className="flex gap-2 mb-2">
                            <input className="input-field flex-1" placeholder="Add tech..." value={techInput} onChange={e => setTechInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTech()} />
                            <button onClick={addTech} className="btn-ghost">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.technologies?.map((t, i) => (
                                <span key={i} className="px-3 py-1 glass-card text-sm flex items-center gap-2">
                                    {t} <button onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) })} className="text-red-400">✕</button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div><label className="block text-white/50 text-sm mb-1">Screenshots</label>
                        <input type="file" accept="image/*" onChange={uploadScreenshot} className="text-sm text-white/50" />
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {form.screenshots?.map((s, i) => (
                                <div key={i} className="relative">
                                    <img src={api.getFileUrl(s)} className="h-20 rounded-lg object-cover" alt="" />
                                    <button onClick={() => setForm({ ...form, screenshots: form.screenshots.filter((_, idx) => idx !== i) })}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })}
                            className="w-4 h-4 rounded bg-dark-700 border-white/20" />
                        <span className="text-white/70 text-sm">Featured project</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={save} className="btn-primary">Save</button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {projects.map((p, i) => (
                    <div key={p._id || i} className="glass-card p-5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {p.screenshots?.[0] && <img src={api.getFileUrl(p.screenshots[0])} className="w-16 h-12 rounded-lg object-cover" alt="" />}
                            <div>
                                <h3 className="font-semibold">{p.name} {p.featured && <span className="text-yellow-400 text-xs">★ Featured</span>}</h3>
                                <p className="text-white/40 text-sm">{p.category} · {p.technologies?.join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(p)} className="text-primary-400 hover:underline text-sm">Edit</button>
                            <button onClick={() => deleteProject(p._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
