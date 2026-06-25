'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function GalleryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
    const [lightbox, setLightbox] = useState(null); // stores active item object

    useEffect(() => {
        api.get('/gallery')
            .then(setItems)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.mediaType === filter;
    });

    const openLightbox = (item) => {
        setLightbox(item);
    };

    const closeLightbox = () => {
        setLightbox(null);
    };

    const navigateLightbox = (direction) => {
        if (!lightbox) return;
        const currentIndex = filteredItems.findIndex(i => i._id === lightbox._id);
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = filteredItems.length - 1;
        if (nextIndex >= filteredItems.length) nextIndex = 0;
        setLightbox(filteredItems[nextIndex]);
    };

    return (
        <div className="pt-24 min-h-screen bg-dark-950 text-white pb-16">
            <div className="section-container">
                {/* ═══ HEADER ═══ */}
                <div className="text-center mb-12 animate-fadeInUp">
                    <p className="text-primary-400 font-medium mb-2 uppercase tracking-wider text-sm">Visual Showcase</p>
                    <h1 className="section-title">Achievements Gallery</h1>
                    <p className="section-subtitle mx-auto">A collection of highlights, certifications, research presentations, and key moments.</p>
                </div>

                {/* ═══ FILTERS ═══ */}
                <div className="flex justify-center gap-3 mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    {[
                        { id: 'all', label: 'All Media', icon: '✨' },
                        { id: 'image', label: 'Photos', icon: '📷' },
                        { id: 'video', label: 'Videos', icon: '🎥' }
                    ].map(btn => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                filter === btn.id
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-cyan text-black shadow-lg shadow-primary-500/20 scale-105'
                                    : 'bg-dark-900 border border-white/5 text-white/60 hover:text-white hover:border-white/10'
                            }`}
                        >
                            <span>{btn.icon}</span>
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* ═══ LOADING STATE ═══ */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-video rounded-3xl bg-dark-900/60 animate-pulse border border-white/5" />
                        ))}
                    </div>
                )}

                {/* ═══ EMPTY STATE ═══ */}
                {!loading && filteredItems.length === 0 && (
                    <div className="glass-card p-16 text-center max-w-lg mx-auto border border-white/5 animate-scaleIn">
                        <span className="text-5xl block mb-4">🖼️</span>
                        <h2 className="text-xl font-heading font-black mb-2">No achievements to display</h2>
                        <p className="text-white/40 text-sm">Please check back later or explore other sections of my portfolio website.</p>
                    </div>
                )}

                {/* ═══ GALLERY GRID ═══ */}
                {!loading && filteredItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideFadeUp">
                        {filteredItems.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => openLightbox(item)}
                                className="group relative overflow-hidden rounded-3xl border border-white/5 hover:border-primary-500/20 bg-dark-900/40 hover:bg-dark-900/60 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-primary-950/20 flex flex-col justify-between"
                            >
                                <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                                    {item.mediaType === 'image' ? (
                                        <img
                                            src={api.getFileUrl(item.mediaUrl)}
                                            alt={item.title}
                                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <video
                                                src={api.getFileUrl(item.mediaUrl)}
                                                className="w-full h-full object-contain"
                                                muted
                                                playsInline
                                            />
                                            {/* Play button overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition-colors">
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                                    <svg className="w-6 h-6 text-white ml-0.5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-dark-955/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/5">
                                        {item.mediaType === 'image' ? '📷 Photo' : '🎥 Video'}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══ LIGHTBOX MODAL ═══ */}
            {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center w-full z-10">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                            Achievement Gallery ({filteredItems.indexOf(lightbox) + 1} / {filteredItems.length})
                        </span>
                        <button
                            onClick={closeLightbox}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex items-center justify-center relative my-4">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => navigateLightbox(-1)}
                            className="absolute left-0 md:left-4 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="max-w-4xl max-h-[50vh] md:max-h-[55vh] w-full h-full flex items-center justify-center p-2">
                            {lightbox.mediaType === 'image' ? (
                                <img
                                    src={api.getFileUrl(lightbox.mediaUrl)}
                                    alt={lightbox.title}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5"
                                />
                            ) : (
                                <video
                                    src={api.getFileUrl(lightbox.mediaUrl)}
                                    className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/5"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            )}
                        </div>

                        <button
                            onClick={() => navigateLightbox(1)}
                            className="absolute right-0 md:right-4 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Bottom Details Panel */}
                    <div className="text-center max-w-3xl mx-auto w-full z-10 p-6 rounded-2xl bg-dark-900/80 border border-white/5 backdrop-blur-md shadow-2xl">
                        <h2 className="font-heading font-black text-lg md:text-xl text-white mb-2">{lightbox.title}</h2>
                        {lightbox.description && (
                            <div className="text-white/70 text-xs md:text-sm leading-relaxed text-left sm:text-center">
                                {lightbox.description}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
