import apiClient from './apiClient';

export const reportLost = async (data) => {
    // data should be FormData if containing image
    return await apiClient.post('/lost-found/lost', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const reportFound = async (data) => {
    return await apiClient.post('/lost-found/found', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllItems = async (params = {}) => {
    // params: { status, search }
    const response = await apiClient.get('/lost-found/all', { params });
    return response.data;
};

export const getMatches = async (params = {}) => {
    // params: { itemName, status }
    const response = await apiClient.get('/lost-found/matches', { params });
    return response.data;
};

export const deleteItem = async (id) => {
    const response = await apiClient.delete(`/lost-found/${id}`);
    return response.data;
};
