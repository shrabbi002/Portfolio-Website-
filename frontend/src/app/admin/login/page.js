'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.login(username, password);
            router.push('/admin');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-dark-900 overflow-hidden p-4">
            {/* Animated Morphing/Floating Background Blobs */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-morph pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-morph pointer-events-none" style={{ animationDelay: '-6s', animationDuration: '16s' }} />
            
            <div className="w-full max-w-md relative z-10 animate-scaleIn">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-cyan
                        flex items-center justify-center text-white font-heading font-black text-2xl mx-auto mb-4 
                        shadow-lg shadow-primary-500/20 hover:scale-110 transition-transform duration-300">
                        A
                    </div>
                    <h1 className="text-3xl font-heading font-extrabold tracking-tight">Admin Portal</h1>
                    <p className="text-white/40 text-sm mt-2">Sign in to manage your portfolio</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card-premium p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-2 animate-vibrate">
                            <span className="text-base">⚠️</span> {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Username</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-base">👤</span>
                            <input type="text" required value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pl-10 bg-dark-900/40 hover:border-white/20 focus:border-primary-500 transition-colors" 
                                placeholder="admin" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-base">🔑</span>
                            <input type="password" required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-10 bg-dark-900/40 hover:border-white/20 focus:border-primary-500 transition-colors" 
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="btn-primary w-full justify-center text-sm font-bold uppercase tracking-wider py-3.5 mt-2 shimmer-effect disabled:opacity-50">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
