import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    checkAuthState();
  }, []);

  // Set axios default authorization header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Verify token is still valid by fetching current user
        try {
          const response = await api.get('/auth/me');
          if (response.data.success && response.data.user) {
            await updateUser(response.data.user);
          }
        } catch (error) {
          // Token invalid, clear storage
          console.log('Token invalid, clearing auth state');
          await logout();
        }
      }
    } catch (error) {
      console.log('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      const { token: userToken, user: userData } = response.data;
      
      if (!userToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Correct IP address in config.js\n3. Both devices on same network\n4. Firewall allows port 5000';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { token: userToken, user: userDataResponse } = response.data;
      
      if (!userToken || !userDataResponse) {
        throw new Error('Invalid response from server');
      }
      
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userDataResponse));
      setToken(userToken);
      setUser(userDataResponse);
      
      return { success: true };
    } catch (error) {
      console.log('Register error:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'Registration failed';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Correct IP address in config.js\n3. Both devices on same network\n4. Firewall allows port 5000';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Update user data in context and storage
  const updateUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.log('Error updating user:', error);
      throw error;
    }
  };

  // Update profile via API
  const updateProfile = async (profileData) => {
    try {
      console.log('Updating profile with data:', profileData);
      
      const response = await api.put('/users/profile', profileData);
      
      const { user: userData } = response.data;
      
      if (!userData) {
        throw new Error('Invalid response from server');
      }
      
      // Update local user data
      await updateUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.log('Update profile error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Profile update failed' 
      };
    }
  };

  // Admin Functions
  const getAllUsers = async (filters = {}) => {
    try {
      const response = await api.get('/v1/admin/users', {
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          role: filters.role !== 'all' ? filters.role : '',
          search: filters.search || ''
        }
      });
      
      const { data } = response.data;
      
      return { 
        success: true, 
        data: {
          users: data,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          totalUsers: response.data.results
        }
      };
    } catch (error) {
      console.log('Get all users error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch users' 
      };
    }
  };

  const getUserStats = async () => {
    try {
      const response = await api.get('/v1/admin/stats/users');
      
      return { 
        success: true,
        stats: response.data.data
      };
    } catch (error) {
      console.log('Get user stats error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch user statistics' 
      };
    }
  };

  const updateUserById = async (userId, userData) => {
    try {
      const response = await api.put(`/v1/admin/users/${userId}`, userData);
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.log('Update user error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to update user' 
      };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/v1/admin/users/${userId}`);
      
      return { success: true };
    } catch (error) {
      console.log('Delete user error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to delete user' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      register, 
      logout, 
      updateUser,
      updateProfile,
      loading,
      // Admin functions
      isAdmin,
      getAllUsers,
      getUserStats,
      updateUserById,  // Fixed: renamed from updateUser
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);