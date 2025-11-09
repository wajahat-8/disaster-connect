import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || 'Login failed' };
      
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || 'Registration failed' };
      
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // ✅ Add this function to update user data
  const updateUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.log('Error updating user:', error);
      throw error;
    }
  };

  // ✅ Add this function to update profile via API
  const updateProfile = async (profileData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.message || 'Profile update failed' };
      }

      // Update local user data
      await updateUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Admin Functions
  const getAllUsers = async (filters) => {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        role: filters.role !== 'all' ? filters.role : '',
        search: filters.search || ''
      }).toString();

      const res = await fetch(`${API_BASE_URL}/auth/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      return { 
        success: true, 
        data: {
          users: data.users,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          totalUsers: data.totalUsers
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/stats/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      return { 
        success: true,
        stats: {
          totalUsers: data.totalUsers,
          totalAdmins: data.totalAdmins,
          totalVolunteers: data.totalVolunteers,
          recentRegistrations: data.recentRegistrations
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserById = async (userId, userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
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
      updateUser: updateUserById,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Add this at the end
export const useAuth = () => useContext(AuthContext);