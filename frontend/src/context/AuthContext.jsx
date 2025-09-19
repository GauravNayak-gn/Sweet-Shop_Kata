import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You might need to install this: npm install jwt-decode
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsAuthenticated(true);
                localStorage.setItem('token', token);
            } catch (error) {
                // Invalid token
                setUser(null);
                setToken(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            }
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setToken(response.data.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    const value = { user, token, isAuthenticated, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;