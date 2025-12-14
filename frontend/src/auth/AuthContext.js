import React, { createContext, useState, useEffect } from 'react';
import { authService } from './auth.service';
import { storageService } from './storage.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const storedToken = await storageService.getToken();
            const storedUser = await storageService.getUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);

                // Verify session in background
                const res = await authService.getMe();
                if (res.success && res.user) {
                    setUser(res.user);
                } else if (res.error) {
                    // If unauthorized, clear state
                    // await logout(); // Optional based on strictness
                }
            }
        } catch (e) {
            console.error('Auth state check failed', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await authService.login(email, password);
        if (res.success) {
            setToken(res.token);
            setUser(res.user);
        }
        return res;
    };

    const register = async (userData) => {
        const res = await authService.register(userData);
        if (res.success) {
            setToken(res.token);
            setUser(res.user);
        }
        return res;
    };

    const logout = async () => {
        await authService.logout();
        setToken(null);
        setUser(null);
    };

    const updateUser = async (userData) => {
        setUser(userData);
        await storageService.setUser(userData);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            updateUser,
            isAdmin: user?.role === 'admin',
        }}>
            {children}
        </AuthContext.Provider>
    );
};
