/**
 * Location utility functions for distance calculations and formatting.
 */

/**
 * Calculate distance between two coordinates using Haversine formula.
 * @param {number} lat1 - First point latitude
 * @param {number} lon1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lon2 - Second point longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

/**
 * Format distance for display.
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    } else if (distanceKm < 10) {
        return `${distanceKm.toFixed(1)} km`;
    } else {
        return `${Math.round(distanceKm)} km`;
    }
};

/**
 * Sort shelters by distance from a given location.
 * @param {Array} shelters - Array of shelter objects
 * @param {Object} userLocation - User's location {latitude, longitude}
 * @returns {Array} Sorted shelters with distance property added
 */
export const sortByDistance = (shelters, userLocation) => {
    if (!userLocation || !shelters) return shelters;

    const { latitude, longitude } = userLocation;

    return shelters
        .map(shelter => {
            // Check if distance already exists (from backend)
            if (shelter.distance !== undefined) {
                return shelter;
            }

            // Calculate distance if not provided
            const [shelterLng, shelterLat] = shelter.location.coordinates;
            const distance = calculateDistance(latitude, longitude, shelterLat, shelterLng);
            return {
                ...shelter,
                distance: parseFloat(distance.toFixed(2))
            };
        })
        .sort((a, b) => a.distance - b.distance);
};

/**
 * Get color code based on distance.
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Color code for the distance
 */
export const getDistanceColor = (distanceKm) => {
    if (distanceKm < 5) return '#10b981'; // Green - Close
    if (distanceKm < 15) return '#f59e0b'; // Orange - Medium
    return '#ef4444'; // Red - Far
};
