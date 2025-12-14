import axios from 'axios';
import { storageService } from './storage.service';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
    baseURL: API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await storageService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log errors centrally if needed
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
