'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * Browser-native replacement for next/navigation hooks.
 * Required for static export (output: 'export') which is
 * incompatible with Next.js useSearchParams/usePathname/useRouter.
 */

export function usePathname() {
    const [pathname, setPathname] = useState('/');

    useEffect(() => {
        setPathname(window.location.pathname);

        const handleRouteChange = () => {
            setPathname(window.location.pathname);
        };

        window.addEventListener('popstate', handleRouteChange);

        // Listen for Next.js client-side navigations
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            handleRouteChange();
        };
        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            handleRouteChange();
        };

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
        };
    }, []);

    return pathname;
}

export function useRouter() {
    const push = useCallback((url) => {
        window.location.href = url;
    }, []);

    const replace = useCallback((url) => {
        window.location.replace(url);
    }, []);

    const back = useCallback(() => {
        window.history.back();
    }, []);

    return { push, replace, back };
}

export function useParams() {
    const [params, setParams] = useState({});

    useEffect(() => {
        // Extract params from URL path based on common patterns
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);

        // For blog/[slug] pattern
        const blogIndex = parts.indexOf('blog');
        if (blogIndex !== -1 && parts[blogIndex + 1]) {
            setParams({ slug: decodeURIComponent(parts[blogIndex + 1]) });
        }
    }, []);

    return params;
}
