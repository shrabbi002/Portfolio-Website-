'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminAbout() {
    const [data, setData] = useState({ biography: '', careerJourney: '', education: [], expertise: [], goals: '', philosophy: '', image: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [newExpertise, setNewExpertise] = useState('');
    const [newEdu, setNewEdu] = useState({ degree: '', institution: '', duration: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [editEdu, setEditEdu] = useState({ degree: '', institution: '', duration: '' });

    useEffect(() => {
        api.get('/about').then(res => {
            setData({
                ...res,
                education: Array.isArray(res?.education) ? res.education : [],
                expertise: Array.isArray(res?.expertise) ? res.expertise : []
            });
        }).catch(console.error);
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await api.put('/about', data);
            setMsg('Saved!');
            setTimeout(() => setMsg(''), 3000);
        } catch (e) {
            setMsg('Error: ' + e.message);
        }
        setSaving(false);
    };

    const addExpertise = () => {
        if (newExpertise.trim()) {
            setData({ ...data, expertise: [...(data.expertise || []), newExpertise.trim()] });
            setNewExpertise('');
        }
    };

    const addEducation = () => {
        if (newEdu.degree.trim() && newEdu.institution.trim() && newEdu.duration.trim()) {
            setData({
                ...data,
                education: [...(data.education || []), { ...newEdu }]
            });
            setNewEdu({ degree: '', institution: '', duration: '' });
        }
    };

    const removeEducation = (index) => {
        setData({
            ...data,
            education: data.education.filter((_, i) => i !== index)
        });
    };

    const startEditing = (index, edu) => {
        setEditingIndex(index);
        setEditEdu({ ...edu });
    };

    const saveEducation = (index) => {
        if (editEdu.degree.trim() && editEdu.institution.trim() && editEdu.duration.trim()) {
            const updated = [...data.education];
            updated[index] = { ...editEdu };
            setData({ ...data, education: updated });
            setEditingIndex(null);
        }
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const res = await api.upload(file);
            setData({ ...data, image: res.url });
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">About Section</h1>
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            <div className="glass-card p-6 space-y-5">
                <div>
                    <label className="block text-white/50 text-sm mb-2">Biography</label>
                    <textarea className="input-field" rows={4} value={data.biography || ''} onChange={e => setData({ ...data, biography: e.target.value })} />
                </div>
                <div>
                    <label className="block text-white/50 text-sm mb-2">Career Journey</label>
                    <textarea className="input-field" rows={3} value={data.careerJourney || ''} onChange={e => setData({ ...data, careerJourney: e.target.value })} />
                </div>
                <div>
                    <label className="block text-white/50 text-sm mb-2">Goals & Research Interests</label>
                    <textarea className="input-field" rows={3} value={data.goals || ''} onChange={e => setData({ ...data, goals: e.target.value })} />
                </div>
                <div>
                    <label className="block text-white/50 text-sm mb-2">Work Philosophy</label>
                    <textarea className="input-field" rows={2} value={data.philosophy || ''} onChange={e => setData({ ...data, philosophy: e.target.value })} />
                </div>
                <div>
                    <label className="block text-white/50 text-sm mb-2">Image</label>
                    <input type="file" accept="image/*" onChange={uploadImage} className="text-sm text-white/50" />
                    {data.image && <img src={api.getFileUrl(data.image)} className="mt-2 h-32 rounded-xl object-cover" alt="" />}
                </div>
            </div>

            {/* Education Manager */}
            <div className="glass-card p-6 space-y-4">
                <h3 className="font-heading font-semibold text-lg text-white">Manage Education (Degrees)</h3>
                
                {/* List of current degrees */}
                <div className="space-y-3">
                    {data.education && data.education.length > 0 ? (
                        data.education.map((edu, i) => (
                            editingIndex === i ? (
                                <div key={i} className="space-y-3 p-4 bg-dark-800/60 rounded-xl border border-primary-500/30">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Degree</label>
                                            <input className="input-field" value={editEdu.degree}
                                                onChange={e => setEditEdu({ ...editEdu, degree: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Institution</label>
                                            <input className="input-field" value={editEdu.institution}
                                                onChange={e => setEditEdu({ ...editEdu, institution: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Duration</label>
                                            <input className="input-field" value={editEdu.duration}
                                                onChange={e => setEditEdu({ ...editEdu, duration: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => saveEducation(i)} className="btn-primary py-1.5 px-4 text-xs">Save</button>
                                        <button onClick={() => setEditingIndex(null)} className="btn-outline py-1.5 px-4 text-xs bg-transparent">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div key={i} className="flex justify-between items-center p-4 bg-dark-800/40 rounded-xl border border-white/5">
                                    <div>
                                        <h4 className="font-bold text-white">{edu.degree}</h4>
                                        <p className="text-primary-300 text-xs">{edu.institution}</p>
                                        <p className="text-white/40 text-[10px] uppercase font-semibold mt-1">{edu.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => startEditing(i, edu)} className="px-3 py-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 text-xs font-semibold rounded-lg transition-colors">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => removeEducation(i)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-colors">
                                            ✕ Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <p className="text-white/30 text-sm italic">No education records added yet.</p>
                    )}
                </div>

                {/* Form to add a new degree */}
                <div className="border-t border-white/5 pt-4">
                    <h4 className="text-white/70 text-sm font-semibold mb-3">Add New Degree</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <input className="input-field" placeholder="Degree (e.g. Master of Science)" value={newEdu.degree}
                            onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                        <input className="input-field" placeholder="Institution (e.g. Jahangirnagar University)" value={newEdu.institution}
                            onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} />
                        <input className="input-field" placeholder="Duration (e.g. July 2025 - Present)" value={newEdu.duration}
                            onChange={e => setNewEdu({ ...newEdu, duration: e.target.value })} />
                    </div>
                    <button onClick={addEducation} className="btn-primary w-full md:w-auto">Add Degree</button>
                </div>
            </div>

            {/* Areas of Expertise */}
            <div className="glass-card p-6">
                <h3 className="font-heading font-semibold mb-4">Areas of Expertise</h3>
                <div className="flex gap-2 mb-4">
                    <input className="input-field flex-1" placeholder="Add expertise..." value={newExpertise}
                        onChange={e => setNewExpertise(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpertise()} />
                    <button onClick={addExpertise} className="btn-primary">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.expertise?.map((e, i) => (
                        <span key={i} className="px-3 py-1.5 glass-card text-sm flex items-center gap-2">
                            {e} <button onClick={() => setData({ ...data, expertise: data.expertise.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-300">✕</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
