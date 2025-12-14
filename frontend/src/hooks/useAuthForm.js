import { useState } from 'react';
import { useAuth } from '../auth';

/**
 * Custom hook for handling authentication form submission.
 * Manages loading state and error messages for login/register forms.
 * 
 * @param {boolean} isLogin - If true, handles login; if false, handles registration
 * @returns {Object} Hook return object
 * @returns {Function} returns.submit - Async function to submit form data
 * @returns {boolean} returns.loading - Whether submission is in progress
 * @returns {string} returns.error - Error message if submission failed
 * 
 * @example
 * // In LoginScreen
 * const { submit, loading, error } = useAuthForm(true);
 * 
 * const handleLogin = async () => {
 *   const success = await submit({ email, password });
 *   if (!success) {
 *     // Handle error (error state is already set)
 *   }
 * };
 */
export const useAuthForm = (isLogin = true) => {
    const { login, register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Submit authentication form data.
     * @param {Object} formData - Form data to submit
     * @param {string} formData.email - User's email
     * @param {string} formData.password - User's password
     * @param {string} [formData.name] - User's name (register only)
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    const submit = async (formData) => {
        setLoading(true);
        setError('');

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            result = await register(formData);
        }

        setLoading(false);

        if (!result.success) {
            setError(result.error || 'Authentication failed');
            return false;
        }

        return true;
    };

    return { submit, loading, error };
};
