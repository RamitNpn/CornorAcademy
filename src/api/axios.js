import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
// Attach access token to every request
api.interceptors.request.use((config) => {
const token = localStorage.getItem('accessToken');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});
// Auto-refresh access token on 401
api.interceptors.response.use(
(res) => res,
async (err) => {
if (err.response?.status === 401 && !err.config._retry) {
err.config._retry = true;
try {
const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
localStorage.setItem('accessToken', data.accessToken);
err.config.headers.Authorization = `Bearer ${data.accessToken}`;
return api(err.config);
} catch { localStorage.removeItem('accessToken'); window.location = '/login'; }
}
return Promise.reject(err);
}

);

export default api;