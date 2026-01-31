import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

// Response interceptor for error handling logic
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.code === 'ECONNABORTED') {
            console.error('Backend timeout');
        }
        return Promise.reject(err);
    }
);
