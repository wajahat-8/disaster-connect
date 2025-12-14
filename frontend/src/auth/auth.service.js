import apiClient from './apiClient';
import { storageService } from './storage.service';
import { errorHelper } from './error.helper';

export const authService = {
    /**
     * Log in the user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{success: boolean, user?: object, token?: string, error?: string}>}
     */
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', { email, password });

            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error('Invalid response from server');
            }

            await storageService.setToken(token);
            await storageService.setUser(user);

            return { success: true, user, token };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Login failed') };
        }
    },

    /**
     * Register a new user
     * @param {object} userData 
     * @returns {Promise<{success: boolean, user?: object, token?: string, error?: string}>}
     */
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData);

            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error('Invalid response from server');
            }

            await storageService.setToken(token);
            await storageService.setUser(user);

            return { success: true, user, token };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Registration failed') };
        }
    },

    /**
     * Get current user profile (verify token)
     * @returns {Promise<{success: boolean, user?: object}>}
     */
    async getMe() {
        try {
            const response = await apiClient.get('/auth/me');
            if (response.data.success && response.data.user) {
                await storageService.setUser(response.data.user); // Update local cache
                return { success: true, user: response.data.user };
            }
            return { success: false };
        } catch (error) {
            return { success: false, error: errorHelper(error) };
        }
    },

    /**
     * Update user profile
     * @param {object} profileData 
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async updateProfile(profileData) {
        try {
            const response = await apiClient.put('/users/profile', profileData);
            const { user } = response.data;

            if (!user) throw new Error('Invalid response');

            await storageService.setUser(user);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Profile update failed') };
        }
    },

    async logout() {
        await storageService.clearAuth();
    }
};
