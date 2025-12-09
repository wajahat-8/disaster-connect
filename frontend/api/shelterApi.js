import api from './apiClient';

export const getShelters = async () => {
    try {
        const response = await api.get('/shelters');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getShelterById = async (id) => {
    try {
        const response = await api.get(`/shelters/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createShelter = async (shelterData) => {
    try {
        const response = await api.post('/shelters', shelterData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateShelter = async (id, shelterData) => {
    try {
        const response = await api.put(`/shelters/${id}`, shelterData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteShelter = async (id) => {
    try {
        const response = await api.delete(`/shelters/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
