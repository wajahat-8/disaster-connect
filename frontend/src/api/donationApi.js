import apiClient from './apiClient';

export const createDonation = async (data) => {
    const response = await apiClient.post('/donations', data);
    return response.data;
};

export const getMyDonations = async () => {
    const response = await apiClient.get('/donations/my-donations');
    return response.data;
};

// Admin only
export const getAllDonations = async () => {
    const response = await apiClient.get('/donations');
    return response.data;
};

export const getDonationSummary = async () => {
    const response = await apiClient.get('/donations/summary');
    return response.data;
};
