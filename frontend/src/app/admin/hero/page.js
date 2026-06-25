'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminHero() {
    const [data, setData] = useState({ headline: '', subtitle: '', introduction: '', profileImage: '', highlights: [], ctaButtons: [] });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { api.get('/hero').then(setData).catch(console.error); }, []);

    const save = async () => {
        setSaving(true);
        try { await api.put('/hero', data); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000); }
        catch (e) { setMsg('Error: ' + e.message); }
        setSaving(false);
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try { const res = await api.upload(file); setData({ ...data, profileImage: res.url }); }
        catch (e) { alert(e.message); }
    };

    const addHighlight = () => setData({ ...data, highlights: [...(data.highlights || []), { number: '', label: '' }] });
    const updateHighlight = (i, field, val) => {
        const h = [...data.highlights]; h[i] = { ...h[i], [field]: val }; setData({ ...data, highlights: h });
    };
    const removeHighlight = (i) => setData({ ...data, highlights: data.highlights.filter((_, idx) => idx !== i) });

    const addCta = () => setData({ ...data, ctaButtons: [...(data.ctaButtons || []), { text: '', link: '', type: 'primary' }] });
    const updateCta = (i, field, val) => {
        const c = [...data.ctaButtons]; c[i] = { ...c[i], [field]: val }; setData({ ...data, ctaButtons: c });
    };
    const removeCta = (i) => setData({ ...data, ctaButtons: data.ctaButtons.filter((_, idx) => idx !== i) });

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Hero Section</h1>
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            <div className="glass-card p-6 space-y-5">
                <div><label className="block text-white/50 text-sm mb-2">Headline</label>
                    <input className="input-field" value={data.headline || ''} onChange={e => setData({ ...data, headline: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Subtitle</label>
                    <input className="input-field" value={data.subtitle || ''} onChange={e => setData({ ...data, subtitle: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Introduction</label>
                    <textarea className="input-field" rows={3} value={data.introduction || ''} onChange={e => setData({ ...data, introduction: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Profile Image</label>
                    <input type="file" accept="image/*" onChange={uploadImage} className="text-sm text-white/50" />
                    {data.profileImage && <img src={api.getFileUrl(data.profileImage)} className="mt-2 h-32 rounded-xl object-cover" alt="" />}
                </div>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-semibold">Highlights</h3>
                    <button onClick={addHighlight} className="btn-ghost text-sm">+ Add</button>
                </div>
                {data.highlights?.map((h, i) => (
                    <div key={i} className="flex gap-3 mb-3 items-center">
                        <input className="input-field w-24" placeholder="50+" value={h.number || ''} onChange={e => updateHighlight(i, 'number', e.target.value)} />
                        <input className="input-field flex-1" placeholder="Projects Completed" value={h.label || ''} onChange={e => updateHighlight(i, 'label', e.target.value)} />
                        <button onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-300 text-xl">✕</button>
                    </div>
                ))}
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-semibold">CTA Buttons</h3>
                    <button onClick={addCta} className="btn-ghost text-sm">+ Add</button>
                </div>
                {data.ctaButtons?.map((btn, i) => (
                    <div key={i} className="flex gap-3 mb-3 items-center flex-wrap">
                        <input className="input-field w-40" placeholder="Button text" value={btn.text || ''} onChange={e => updateCta(i, 'text', e.target.value)} />
                        <input className="input-field flex-1" placeholder="/projects" value={btn.link || ''} onChange={e => updateCta(i, 'link', e.target.value)} />
                        <select className="input-field w-32" value={btn.type || 'primary'} onChange={e => updateCta(i, 'type', e.target.value)}>
                            <option value="primary">Primary</option><option value="secondary">Secondary</option><option value="outline">Outline</option>
                        </select>
                        <button onClick={() => removeCta(i)} className="text-red-400 hover:text-red-300 text-xl">✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
