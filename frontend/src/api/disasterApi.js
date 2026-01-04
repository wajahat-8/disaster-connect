import apiClient from './apiClient';

/**
 * Get disasters near a specific location.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in kilometers (default 50)
 * @returns {Promise<Object>} API response with disasters array
 */
export const getNearbyDisasters = async (lat, lng, radius = 50) => {
    const response = await apiClient.get('/disasters/nearby', {
        params: { lat, lng, radius }
    });
    return response.data;
};

/**
 * Get all disasters.
 * @returns {Promise<Object>} API response with disasters array
 */
export const getAllDisasters = async () => {
    const response = await apiClient.get('/disasters');
    return response.data;
};
