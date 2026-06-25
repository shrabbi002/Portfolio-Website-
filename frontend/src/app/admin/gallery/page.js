'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminGallery() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', mediaType: 'image', mediaUrl: '', featured: false, order: 0 });
    const [msg, setMsg] = useState('');
    const [uploading, setUploading] = useState(false);

    const load = () => api.get('/gallery').then(setItems).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => {
        setEditing('new');
        setForm({ title: '', description: '', mediaType: 'image', mediaUrl: '', featured: false, order: items.length });
    };

    const startEdit = (item) => {
        setEditing(item._id);
        setForm({ ...item });
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await api.upload(file);
            const isVideo = file.type.startsWith('video') || /\.(mp4|webm|ogg|mov|mkv)$/i.test(file.name);
            setForm(prev => ({
                ...prev,
                mediaUrl: res.url,
                mediaType: isVideo ? 'video' : 'image'
            }));
            setMsg('File uploaded successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const save = async () => {
        if (!form.title || !form.mediaUrl) {
            setMsg('Error: Title and Media URL are required');
            return;
        }
        try {
            if (editing === 'new') {
                await api.post('/gallery', form);
            } else {
                await api.put(`/gallery/${editing}`, form);
            }
            setEditing(null);
            load();
            setMsg('Saved successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Error: ' + err.message);
        }
    };

    const deleteItem = async (id) => {
        if (!confirm('Delete this gallery item?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            load();
            setMsg('Deleted successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Achievement Gallery Manager</h1>
                <button onClick={startNew} className="btn-primary">+ Add New Item</button>
            </div>
            {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.startsWith('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {msg}
                </div>
            )}

            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <h3 className="font-heading font-semibold text-lg">{editing === 'new' ? 'Add' : 'Edit'} Gallery Item</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-1">Title *</label>
                            <input className="input-field" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Research Presentation Award" />
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1">Order</label>
                            <input type="number" className="input-field" value={form.order || 0} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/50 text-sm mb-1">Description</label>
                        <textarea className="input-field min-h-[80px]" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the achievement..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-white/50 text-sm mb-1">Media Type</label>
                            <select className="input-field" value={form.mediaType} onChange={e => setForm({ ...form, mediaType: e.target.value })}>
                                <option value="image">📷 Image</option>
                                <option value="video">🎥 Video</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-white/50 text-sm mb-1">Upload Media (Image/Video) *</label>
                            <div className="flex gap-3 items-center">
                                <input type="file" accept="image/*,video/*" onChange={handleUpload} className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-500/20 file:text-primary-300 hover:file:bg-primary-500/30 file:cursor-pointer" />
                                {uploading && <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/50 text-sm mb-1">Media URL (Autofilled on upload)</label>
                        <input className="input-field bg-dark-900/50" value={form.mediaUrl || ''} onChange={e => setForm({ ...form, mediaUrl: e.target.value })} placeholder="/uploads/..." />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-white/10 bg-dark-800 text-primary-500 focus:ring-primary-500/50" />
                        <label htmlFor="featured" className="text-white/70 text-sm select-none cursor-pointer">Feature on front page</label>
                    </div>

                    {form.mediaUrl && (
                        <div className="border border-white/5 rounded-2xl overflow-hidden max-w-sm bg-dark-900/50 p-2">
                            <p className="text-xs text-white/40 mb-2">Preview:</p>
                            {form.mediaType === 'image' ? (
                                <img src={api.getFileUrl(form.mediaUrl)} className="max-h-48 w-full object-cover rounded-xl" alt="Preview" />
                            ) : (
                                <video src={api.getFileUrl(form.mediaUrl)} className="max-h-48 w-full object-cover rounded-xl" controls />
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={save} className="btn-primary" disabled={uploading}>Save</button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                    <div key={item._id} className="glass-card overflow-hidden border border-white/5 hover:border-white/10 flex flex-col justify-between group">
                        <div>
                            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                                {item.mediaType === 'image' ? (
                                    <img src={api.getFileUrl(item.mediaUrl)} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                                ) : (
                                    <video src={api.getFileUrl(item.mediaUrl)} className="w-full h-full object-contain" controls={false} muted />
                                )}
                                <span className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium border border-white/5">
                                    {item.mediaType === 'image' ? '📷 Image' : '🎥 Video'}
                                </span>
                                {item.featured && (
                                    <span className="absolute top-3 right-3 bg-primary-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider text-black">
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>
                            <div className="p-5 space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-heading font-bold text-lg text-white line-clamp-1">{item.title}</h3>
                                    <span className="text-xs text-white/30 font-mono">Order: {item.order}</span>
                                </div>
                                <p className="text-white/60 text-sm line-clamp-2">{item.description || 'No description provided.'}</p>
                            </div>
                        </div>
                        <div className="p-5 pt-0 flex gap-3 border-t border-white/5 mt-4">
                            <button onClick={() => startEdit(item)} className="btn-ghost flex-1 py-2 text-xs justify-center hover:bg-primary-500/10 hover:text-primary-400">Edit</button>
                            <button onClick={() => deleteItem(item._id)} className="px-4 py-2 rounded-xl text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-semibold">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="glass-card p-12 text-center border border-dashed border-white/10">
                    <span className="text-4xl block mb-3">🖼️</span>
                    <h3 className="text-lg font-heading font-black mb-1">No achievement media uploaded</h3>
                    <p className="text-white/40 text-sm max-w-sm mx-auto">Start by uploading photos or videos of your professional and research achievements.</p>
                </div>
            )}
        </div>
    );
}
