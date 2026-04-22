import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            api.get('/auth/me').then(res => setUser(res.data)).catch(() => { })
                .finally(() => setLoading(false));
        } else setLoading(false);
    }, []);
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data.user);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);