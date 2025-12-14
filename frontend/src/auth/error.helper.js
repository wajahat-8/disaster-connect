export const errorHelper = (error, defaultMessage = 'An unexpected error occurred') => {


    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        return 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Correct IP address in config.js\n3. Both devices on same network\n4. Firewall allows port 5000';
    }

    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return defaultMessage;
};
