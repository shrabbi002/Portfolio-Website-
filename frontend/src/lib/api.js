const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class ApiClient {
    constructor() {
        this.baseUrl = API_URL;
    }

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin_token');
        }
        return null;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        const token = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(url, { ...options, headers });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'API request failed');
        return data;
    }

    // Auth
    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_token', data.token);
        }
        return data;
    }

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
        }
        cache.clear();
    }

    // Cached GET — returns data instantly if cached, fetches in background
    getCached(endpoint) {
        const entry = cache.get(endpoint);
        if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
        return null;
    }

    async get(endpoint) {
        const data = await this.request(endpoint);
        cache.set(endpoint, { data, time: Date.now() });
        return data;
    }

    async post(endpoint, data) {
        const result = await this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
        this._invalidate(endpoint);
        return result;
    }

    async put(endpoint, data) {
        const result = await this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
        this._invalidate(endpoint);
        return result;
    }

    async delete(endpoint) {
        const result = await this.request(endpoint, { method: 'DELETE' });
        this._invalidate(endpoint);
        return result;
    }

    _invalidate(endpoint) {
        // Clear exact match and parent path (e.g. /projects/123 clears /projects)
        cache.delete(endpoint);
        const parent = endpoint.replace(/\/[^/]+$/, '');
        if (parent) cache.delete(parent);
    }

    // File upload
    async upload(file) {
        const formData = new FormData();
        formData.append('file', file);
        const token = this.getToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Upload failed');
        return data;
    }

    getFileUrl(path) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${this.baseUrl.replace('/api', '')}${path}`;
    }
}

const api = new ApiClient();
export default api;

