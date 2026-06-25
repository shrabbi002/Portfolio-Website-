'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminBlog() {
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'General', tags: [], isPublished: false, featuredImage: '' });
    const [tagInput, setTagInput] = useState('');
    const [msg, setMsg] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dragOver, setDragOver] = useState(false);

    const load = () => api.get('/blog').then(setPosts).catch(console.error);
    useEffect(() => { load(); }, []);

    const startNew = () => { setEditing('new'); setForm({ title: '', content: '', excerpt: '', category: 'General', tags: [], isPublished: false, featuredImage: '' }); };
    const startEdit = (p) => { setEditing(p._id); setForm({ ...p }); };

    const addTag = () => { if (tagInput.trim()) { setForm({ ...form, tags: [...(form.tags || []), tagInput.trim()] }); setTagInput(''); } };

    const handleImageUpload = async (file) => {
        if (!file) return;
        try { const res = await api.upload(file); setForm({ ...form, featuredImage: res.url }); } catch (e) { alert(e.message); }
    };

    const save = async () => {
        try {
            if (editing === 'new') await api.post('/blog', form);
            else await api.put(`/blog/${editing}`, form);
            setEditing(null); load(); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
        } catch (e) { setMsg('Error: ' + e.message); }
    };

    const deletePost = async (id) => {
        if (!confirm('Delete this blog post?')) return;
        try { await api.delete(`/blog/${id}`); load(); } catch (e) { alert(e.message); }
    };

    const togglePublish = async (p) => {
        try {
            await api.put(`/blog/${p._id}`, { ...p, isPublished: !p.isPublished });
            load();
        } catch (e) { alert(e.message); }
    };

    // Dashboard stats
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.isPublished).length;
    const draftPosts = posts.filter(p => !p.isPublished).length;
    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
    const totalTags = [...new Set(posts.flatMap(p => p.tags || []))].length;
    const totalWords = posts.reduce((acc, p) => acc + (p.content?.split(/\s+/).length || 0), 0);
    const avgReadTime = totalPosts > 0 ? Math.ceil(totalWords / totalPosts / 200) : 0;

    // Filtered posts
    const filteredPosts = posts
        .filter(p => filterStatus === 'all' || (filterStatus === 'published' ? p.isPublished : !p.isPublished))
        .filter(p => !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="max-w-6xl space-y-6">
            {/* ═══ HEADER ═══ */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Blog Manager</h1>
                    <p className="text-white/40 text-sm mt-1">Create, manage, and publish your blog posts</p>
                </div>
                <button onClick={startNew} className="btn-primary flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    New Post
                </button>
            </div>
            {msg && <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">{msg}</div>}

            {/* ═══ DASHBOARD STATS ═══ */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Total Posts', value: totalPosts, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>, color: 'from-violet-500 to-purple-600' },
                    { label: 'Published', value: publishedPosts, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Drafts', value: draftPosts, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>, color: 'from-amber-500 to-orange-600' },
                    { label: 'Categories', value: categories.length, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>, color: 'from-sky-500 to-blue-600' },
                    { label: 'Total Tags', value: totalTags, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" /></svg>, color: 'from-rose-500 to-pink-600' },
                    { label: 'Avg Read', value: `${avgReadTime}m`, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, color: 'from-indigo-500 to-violet-600' },
                ].map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-dark-800/40 p-4 hover:border-white/10 transition-all duration-300">
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.color} opacity-[0.06] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.12] transition-opacity`} />
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                            {stat.icon}
                        </div>
                        <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                        <p className="text-white/35 text-xs uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ═══ CONTENT DISTRIBUTION ═══ */}
            {categories.length > 0 && (
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-sm text-white/60 mb-4">Content Distribution</h3>
                    <div className="space-y-3">
                        {categories.map((cat, i) => {
                            const count = posts.filter(p => p.category === cat).length;
                            const pct = Math.round((count / totalPosts) * 100);
                            const barColors = ['bg-violet-500', 'bg-emerald-500', 'bg-sky-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];
                            return (
                                <div key={cat} className="flex items-center gap-4">
                                    <span className="text-white/60 text-sm w-40 truncate">{cat}</span>
                                    <div className="flex-1 h-2.5 bg-dark-700/80 rounded-full overflow-hidden">
                                        <div className={`h-full ${barColors[i % barColors.length]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-white/40 text-xs w-12 text-right">{count} ({pct}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══ EDITOR ═══ */}
            {editing && (
                <div className="glass-card p-6 space-y-4 border border-primary-500/30">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading font-semibold flex items-center gap-2">
                            {editing === 'new' ? (
                                <><svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> New Post</>
                            ) : (
                                <><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> Edit Post</>
                            )}
                        </h3>
                        <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white/60 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div><label className="block text-white/50 text-sm mb-1">Title</label>
                        <input className="input-field" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter blog post title..." /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Excerpt</label>
                        <textarea className="input-field" rows={2} value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="A brief summary of the post..." /></div>
                    <div><label className="block text-white/50 text-sm mb-1">Content (Markdown supported)</label>
                        <textarea className="input-field font-mono text-sm" rows={12} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your blog post content here..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-white/50 text-sm mb-1">Category</label>
                            <select className="input-field" value={form.category || 'General'} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {['General', 'AI & Research', 'AI & Machine Learning', 'Software Testing', 'Business Analysis', 'System Architecture', 'Research'].map(c =>
                                    <option key={c} value={c}>{c}</option>)}
                            </select></div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1">Featured Image</label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files[0]); }}
                                className={`relative rounded-xl border border-dashed transition-all p-3 text-center cursor-pointer ${dragOver ? 'border-primary-400 bg-primary-500/10' : 'border-white/10 hover:border-white/20'
                                    }`}>
                                {form.featuredImage ? (
                                    <div className="flex items-center gap-3">
                                        <img src={api.getFileUrl(form.featuredImage)} className="h-12 w-20 rounded-lg object-cover" alt="" />
                                        <div className="flex-1 text-left">
                                            <p className="text-xs text-emerald-400">Image uploaded ✓</p>
                                        </div>
                                        <label className="px-2 py-1 rounded bg-white/5 text-white/50 text-xs cursor-pointer hover:bg-white/10">
                                            Change <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="hidden" />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="block cursor-pointer">
                                        <svg className="w-6 h-6 mx-auto text-white/20 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                                        <p className="text-white/30 text-xs">Drop image or click</p>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <div><label className="block text-white/50 text-sm mb-1">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input className="input-field flex-1" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                            <button onClick={addTag} className="btn-ghost">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.tags?.map((t, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm flex items-center gap-2">
                                    #{t} <button onClick={() => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-300">✕</button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800/80 transition-colors">
                        <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.isPublished ? 'bg-emerald-500' : 'bg-dark-600'}`}>
                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${form.isPublished ? 'left-[22px]' : 'left-0.5'}`} />
                        </div>
                        <span className="text-white/70 text-sm">{form.isPublished ? 'Published' : 'Draft'}</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                        <button onClick={save} className="btn-primary flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            Save Post
                        </button>
                        <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                    </div>
                </div>
            )}

            {/* ═══ SEARCH & FILTER ═══ */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    <input className="input-field pl-10" placeholder="Search posts by title or category..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    {['all', 'published', 'drafts'].map(f => (
                        <button key={f} onClick={() => setFilterStatus(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === f
                                ? 'bg-primary-500 text-white'
                                : 'bg-dark-800/50 text-white/40 hover:text-white/70'
                                }`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ POSTS LIST ═══ */}
            <div className="space-y-4">
                {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                        <svg className="w-12 h-12 mx-auto text-white/10 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                        <p className="text-white/30 text-sm">No posts found</p>
                    </div>
                )}
                {filteredPosts.map((p, i) => {
                    const wordCount = p.content?.split(/\s+/).length || 0;
                    const readTime = Math.ceil(wordCount / 200);
                    return (
                        <div key={p._id || i} className="group glass-card p-5 hover:border-white/10 transition-all duration-300">
                            <div className="flex items-start gap-5">
                                {/* Thumbnail */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-dark-700/50">
                                    {p.featuredImage ? (
                                        <img src={api.getFileUrl(p.featuredImage)} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-heading font-semibold text-white group-hover:text-primary-400 transition-colors truncate">{p.title}</h3>
                                        <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${p.isPublished ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                            {p.isPublished ? '● Published' : '○ Draft'}
                                        </span>
                                    </div>
                                    {p.excerpt && <p className="text-white/35 text-sm truncate mb-2">{p.excerpt}</p>}
                                    <div className="flex items-center gap-4 text-xs text-white/25">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /></svg>
                                            {p.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                            {readTime} min read
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                            {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                            {wordCount.toLocaleString()} words
                                        </span>
                                        {p.tags?.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" /></svg>
                                                {p.tags.length} tags
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => togglePublish(p)}
                                        className={`p-2 rounded-lg transition-colors ${p.isPublished ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-emerald-500/10 text-emerald-400'}`}
                                        title={p.isPublished ? 'Unpublish' : 'Publish'}>
                                        {p.isPublished ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                        )}
                                    </button>
                                    <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-primary-500/10 text-primary-400 transition-colors" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                    </button>
                                    <button onClick={() => deletePost(p._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors" title="Delete">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
