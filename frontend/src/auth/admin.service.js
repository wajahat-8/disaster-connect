import apiClient from './apiClient';
import { errorHelper } from './error.helper';

export const adminService = {
    /**
     * Get all users with filters
     * @param {object} filters 
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async getAllUsers(filters = {}) {
        try {
            const response = await apiClient.get('/users', {
                params: {
                    page: filters.page || 1,
                    limit: filters.limit || 10,
                    role: filters.role !== 'all' ? filters.role : '',
                    search: filters.search || ''
                }
            });
            // Flatten the response structure for easier consumption
            return {
                success: true,
                data: {
                    users: response.data.users,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                    totalUsers: response.data.count
                }
            };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Failed to fetch users') };
        }
    },

    /**
     * Update a user by ID
     * @param {string} userId 
     * @param {object} userData 
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async updateUserById(userId, userData) {
        try {
            const response = await apiClient.put(`/users/${userId}`, userData);
            return { success: true, data: response.data.user };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Failed to update user') };
        }
    },

    /**
     * Delete a user
     * @param {string} userId 
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async deleteUser(userId) {
        try {
            await apiClient.delete(`/users/${userId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Failed to delete user') };
        }
    },

    /**
     * Get user statistics
     * @returns {Promise<{success: boolean, stats?: object, error?: string}>}
     */
    async getUserStats() {
        try {
            const response = await apiClient.get('/users/stats');
            return { success: true, stats: response.data.stats };
        } catch (error) {
            return { success: false, error: errorHelper(error, 'Failed to fetch user statistics') };
        }
    }
};
