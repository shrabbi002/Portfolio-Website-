import BlogPostContent from '@/components/public/BlogPostContent';

export async function generateStaticParams() {
    return [];
}

export const dynamicParams = false;

export default function BlogPostPage() {
    return <BlogPostContent />;
}
