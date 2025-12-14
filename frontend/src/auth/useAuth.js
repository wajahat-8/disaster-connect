import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from './auth.service';
import { adminService } from './admin.service';

/**
 * Custom hook to access auth context and exposed services
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return {
        ...context,
        // Expose service methods directly through the hook for convenience
        // This maintains the original API where useAuth() provided these functions
        updateProfile: authService.updateProfile,
        getAllUsers: adminService.getAllUsers,
        updateUser: adminService.updateUserById, // Mapping to match original naming if needed
        deleteUser: adminService.deleteUser,
        getUserStats: adminService.getUserStats,
    };
};
