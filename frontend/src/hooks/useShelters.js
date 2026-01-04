import { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

/**
 * Custom hook for managing shelter data.
 * Provides functions to fetch shelters and get shelter details.
 * 
 * @returns {Object} Hook return object
 * @returns {Array} returns.shelters - Array of shelter objects
 * @returns {boolean} returns.loading - Whether data is being fetched
 * @returns {string|null} returns.error - Error message if fetch failed
 * @returns {Function} returns.fetchShelters - Function to fetch shelters with filters
 * @returns {Function} returns.getShelterById - Function to get a single shelter by ID
 * 
 * @example
 * const { shelters, loading, error, fetchShelters } = useShelters();
 * 
 * useEffect(() => {
 *   fetchShelters({ lat: 37.7749, lng: -122.4194, radius: 10 });
 * }, []);
 */
export const useShelters = () => {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch shelters with optional filters.
     * @param {Object} params - Query parameters
     * @param {number} [params.lat] - Latitude for location-based search
     * @param {number} [params.lng] - Longitude for location-based search
     * @param {number} [params.radius] - Search radius in kilometers
     * @param {string} [params.search] - Search query for shelter name
     * @returns {Promise<void>}
     */
    const fetchShelters = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { lat, lng, radius, search } = params;
            const queryParams = new URLSearchParams();

            if (lat) queryParams.append('lat', lat);
            if (lng) queryParams.append('lng', lng);
            if (search) queryParams.append('search', search);

            const response = await apiClient.get(`/shelters?${queryParams.toString()}`);

            if (response.data.success) {
                setShelters(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching shelters:', err);
            setError('Failed to load shelters');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get a single shelter by its ID.
     * @param {string} id - Shelter ID
     * @returns {Promise<Object|null>} Shelter object or null if not found
     */
    const getShelterById = async (id) => {
        try {
            const response = await apiClient.get(`/shelters/${id}`);
            if (response.data.success) return response.data.data;
        } catch (e) {
            console.error('Error getting shelter details', e);
            return null;
        }
    };

    return {
        shelters,
        loading,
        error,
        fetchShelters,
        getShelterById
    };
};
