import { API_BASE_URL as CONFIG_API_BASE_URL } from '../config';

/**
 * Constructs a full URL for an image path
 * Handles both lost/found and disaster images, including legacy paths
 * @param {string} imagePath - The image path from the database
 * @returns {string|null} - The full URL or null if invalid
 */
export const getImageUrl = (imagePath) => {
    // Handle null, undefined, empty string, or invalid values
    if (!imagePath || 
        imagePath === 'no-photo.jpg' || 
        imagePath === 'null' || 
        imagePath === 'undefined' ||
        (typeof imagePath === 'string' && imagePath.trim() === '')) {
        return null;
    }
    
    // If already a full URL, return as is
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get API_BASE_URL with fallback
    const apiBaseUrl = CONFIG_API_BASE_URL || 'http://192.168.10.5:5000/api';
    
    // Remove /api from API_BASE_URL since static files are served from root
    const baseUrl = apiBaseUrl.replace('/api', '');
    
    // Ensure imagePath starts with / if it doesn't already
    let path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Handle legacy paths that might be missing directories
    // Lost/Found: /uploads/lostfound-xxx.jpeg -> /uploads/lostfound/lostfound-xxx.jpeg
    if (path.startsWith('/uploads/lostfound-') && !path.startsWith('/uploads/lostfound/')) {
        path = path.replace('/uploads/lostfound-', '/uploads/lostfound/lostfound-');
    }
    
    // Disaster: /uploads/disaster-xxx.jpeg -> /uploads/disasters/disaster-xxx.jpeg
    if (path.startsWith('/uploads/disaster-') && !path.startsWith('/uploads/disasters/')) {
        path = path.replace('/uploads/disaster-', '/uploads/disasters/disaster-');
    }
    
    const fullUrl = `${baseUrl}${path}`;
    
    if (__DEV__) {
        if (imagePath !== path) {
            console.log('Image path corrected:', imagePath, '->', path);
        }
        console.log('Image URL constructed:', fullUrl, 'from original path:', imagePath);
    }
    
    return fullUrl;
};
