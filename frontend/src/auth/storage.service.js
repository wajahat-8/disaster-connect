import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys configuration - centralized for easy management
 */
const STORAGE_KEYS = Object.freeze({
    TOKEN: 'userToken',
    USER: 'userData',
});

/**
 * Generic storage helper for setting items
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @param {string} errorContext - Context for error messages
 */
const setItem = async (key, value, errorContext) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error saving ${errorContext}:`, error);
        throw error;
    }
};

/**
 * Generic storage helper for getting items
 * @param {string} key - Storage key
 * @param {string} errorContext - Context for error messages
 * @returns {Promise<string|null>} The stored value or null
 */
const getItem = async (key, errorContext) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.error(`Error getting ${errorContext}:`, error);
        throw error;
    }
};

/**
 * Generic storage helper for removing items
 * @param {string} key - Storage key
 * @param {string} errorContext - Context for error messages
 */
const removeItem = async (key, errorContext) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${errorContext}:`, error);
        throw error;
    }
};

/**
 * Storage service for managing authentication data persistence
 * Provides a clean API for token and user data management
 */
export const storageService = {
    /**
     * Stores the authentication token
     * @param {string} token - JWT or authentication token
     * @throws {Error} If token is invalid or storage fails
     */
    async setToken(token) {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid token: must be a non-empty string');
        }
        await setItem(STORAGE_KEYS.TOKEN, token, 'token');
    },

    /**
     * Retrieves the stored authentication token
     * @returns {Promise<string|null>} The token or null if not found
     */
    async getToken() {
        return await getItem(STORAGE_KEYS.TOKEN, 'token');
    },

    /**
     * Removes the stored authentication token
     */
    async removeToken() {
        await removeItem(STORAGE_KEYS.TOKEN, 'token');
    },

    /**
     * Stores user data object
     * @param {Object} user - User data object to store
     * @throws {Error} If user is invalid or storage fails
     */
    async setUser(user) {
        if (!user || typeof user !== 'object') {
            throw new Error('Invalid user: must be a non-null object');
        }
        await setItem(STORAGE_KEYS.USER, JSON.stringify(user), 'user data');
    },

    /**
     * Retrieves the stored user data
     * @returns {Promise<Object|null>} The user object or null if not found
     */
    async getUser() {
        const jsonValue = await getItem(STORAGE_KEYS.USER, 'user data');
        return jsonValue ? JSON.parse(jsonValue) : null;
    },

    /**
     * Removes the stored user data
     */
    async removeUser() {
        await removeItem(STORAGE_KEYS.USER, 'user data');
    },

    /**
     * Clears all authentication data (token and user)
     * Useful for logout operations
     */
    async clearAuth() {
        await Promise.all([
            this.removeToken(),
            this.removeUser(),
        ]);
    },

    /**
     * Checks if a user is currently authenticated
     * @returns {Promise<boolean>} True if token exists
     */
    async isAuthenticated() {
        const token = await this.getToken();
        return !!token;
    },
};
