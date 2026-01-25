import React, { createContext, useState, useEffect } from 'react';
import { authService } from './auth.service';
import { storageService } from './storage.service';
import { initializeNotifications } from '../services/notificationService';

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
                    await storageService.setUser(res.user);

                    // Initialize notifications on auto-login
                    try {
                        await initializeNotifications();
                    } catch (error) {
                        console.error('Error initializing notifications on auto-login:', error);
                    }
                } else {
                    // If unauthorized or error, clear state to prevent stale session
                    await logout();
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

            // Initialize push notifications after successful login
            try {
                await initializeNotifications();
            } catch (error) {
                console.error('Error initializing notifications:', error);
            }
        }
        return res;
    };

    const register = async (userData) => {
        const res = await authService.register(userData);
        if (res.success) {
            setToken(res.token);
            setUser(res.user);

            // Initialize push notifications after successful registration
            try {
                await initializeNotifications();
            } catch (error) {
                console.error('Error initializing notifications:', error);
            }
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

    const updateProfile = async (profileData) => {
        const res = await authService.updateProfile(profileData);
        if (res.success && res.user) {
            setUser(res.user);
        }
        return res;
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            updateUser,
            updateProfile,
            isAdmin: user?.role === 'admin',
            logout,
        }}>            {children}
        </AuthContext.Provider>
    );
};
