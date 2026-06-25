'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

// Hook that returns cached data instantly, then refreshes from API
export function useApiData(endpoint, fallback = null) {
    const [data, setData] = useState(() => api.getCached(endpoint) ?? fallback);
    const [loading, setLoading] = useState(() => !api.getCached(endpoint));

    const refresh = useCallback(() => {
        api.get(endpoint)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [endpoint]);

    useEffect(() => { refresh(); }, [refresh]);

    return { data, loading, refresh };
}

// Same but for multiple endpoints at once
export function useMultiApiData(endpoints) {
    const [data, setData] = useState(() => {
        const initial = {};
        for (const [key, ep] of Object.entries(endpoints)) {
            initial[key] = api.getCached(ep.url) ?? ep.fallback ?? null;
        }
        return initial;
    });
    const [loading, setLoading] = useState(() => {
        return Object.values(endpoints).some(ep => !api.getCached(ep.url));
    });

    useEffect(() => {
        Promise.all(
            Object.entries(endpoints).map(async ([key, ep]) => {
                try {
                    const result = await api.get(ep.url);
                    return [key, result];
                } catch {
                    return [key, ep.fallback ?? null];
                }
            })
        ).then(results => {
            const newData = {};
            for (const [key, val] of results) newData[key] = val;
            setData(newData);
            setLoading(false);
        });
    }, []);

    return { data, loading };
}
