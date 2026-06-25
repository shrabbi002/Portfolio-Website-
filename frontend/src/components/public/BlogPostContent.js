'use client';
import { useState, useEffect } from 'react';
import { useParams } from '@/lib/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function BlogPostContent() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const slug = params?.slug || window.location.pathname.split('/blog/')[1]?.replace(/\/$/, '');
        if (slug) {
            api.get(`/blog/${slug}`).then(setPost).catch(console.error).finally(() => setLoading(false));
        }
    }, [params?.slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <span className="text-6xl">404</span>
            <p className="text-white/50">Post not found</p>
            <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
    );

    return (
        <div className="pt-24 section-padding">
            <div className="section-container max-w-4xl">
                <Link href="/blog" className="text-primary-400 hover:underline text-sm mb-8 inline-flex items-center gap-2">
                    ← Back to Blog
                </Link>

                {post.featuredImage && (
                    <div className="rounded-2xl overflow-hidden mb-8 h-72 lg:h-96">
                        <img src={api.getFileUrl(post.featuredImage)} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full">{post.category}</span>
                    <span className="text-white/40 text-sm">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-8">{post.title}</h1>

                <div className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>

                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10">
                        {post.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 glass-card text-white/50 text-sm">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
