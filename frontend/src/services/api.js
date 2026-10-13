import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.error || err.message;
        return Promise.reject(new Error(message));
    }
);

export default api;