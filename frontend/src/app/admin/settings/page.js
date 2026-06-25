'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminSettings() {
    const [data, setData] = useState({ siteTitle: '', siteDescription: '', metaDescription: '', footerText: '', socialLinks: { linkedin: '', github: '', twitter: '', scholar: '' } });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { api.get('/settings').then(setData).catch(console.error); }, []);

    const save = async () => {
        setSaving(true);
        try { await api.put('/settings', data); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000); }
        catch (e) { setMsg('Error: ' + e.message); }
        setSaving(false);
    };

    const updateSocial = (key, val) => setData({ ...data, socialLinks: { ...(data.socialLinks || {}), [key]: val } });

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Site Settings</h1>
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            <div className="glass-card p-6 space-y-5">
                <div><label className="block text-white/50 text-sm mb-2">Site Title</label>
                    <input className="input-field" value={data.siteTitle || ''} onChange={e => setData({ ...data, siteTitle: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Site Description</label>
                    <textarea className="input-field" rows={2} value={data.siteDescription || ''} onChange={e => setData({ ...data, siteDescription: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Meta Description (SEO)</label>
                    <textarea className="input-field" rows={2} value={data.metaDescription || ''} onChange={e => setData({ ...data, metaDescription: e.target.value })} /></div>
                <div><label className="block text-white/50 text-sm mb-2">Footer Text</label>
                    <input className="input-field" value={data.footerText || ''} onChange={e => setData({ ...data, footerText: e.target.value })} /></div>
            </div>

            <div className="glass-card p-6 space-y-5">
                <h3 className="font-heading font-semibold">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-white/50 text-sm mb-1">LinkedIn</label>
                        <input className="input-field" value={data.socialLinks?.linkedin || ''} onChange={e => updateSocial('linkedin', e.target.value)} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">GitHub</label>
                        <input className="input-field" value={data.socialLinks?.github || ''} onChange={e => updateSocial('github', e.target.value)} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Twitter/X</label>
                        <input className="input-field" value={data.socialLinks?.twitter || ''} onChange={e => updateSocial('twitter', e.target.value)} /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Google Scholar</label>
                        <input className="input-field" value={data.socialLinks?.scholar || ''} onChange={e => updateSocial('scholar', e.target.value)} /></div>
                </div>
            </div>
        </div>
    );
}
