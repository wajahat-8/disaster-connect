export const errorHelper = (error, defaultMessage = 'An unexpected error occurred') => {


    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        return 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Correct IP address in config.js\n3. Both devices on same network\n4. Firewall allows port 5000';
    }

    if (error.response && error.response.data) {
        const data = error.response.data;

        // If backend returns a message
        if (data.message) {
            if (Array.isArray(data.message)) return data.message.join('. ');
            return typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        }

        // If backend returns an error field
        if (data.error) {
            return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        }

        // If data itself is a string
        if (typeof data === 'string') {
            return data;
        }
    }

    if (error.message) {
        return error.message;
    }

    return defaultMessage;
};
