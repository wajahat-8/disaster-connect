import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper'; // Note: importing useTheme
import { useAuth } from '../../auth';
import AppLoader from '../../components/common/AppLoader';
import {
  UserStatsCard,
  UserFilters,
  UserListItem,
  UserEditModal,
  Pagination
} from './components';

const AdminUsersScreen = () => {
  const { getAllUsers, updateUser, deleteUser, getUserStats, isAdmin } = useAuth();
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadStats();
    }
  }, [filters, isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers(filters);
    setLoading(false);

    if (result.success) {
      setUsers(result.data.users);
      setPagination({
        totalPages: result.data.totalPages,
        currentPage: result.data.currentPage,
        totalUsers: result.data.totalUsers
      });
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const loadStats = async () => {
    const result = await getUserStats();
    if (result.success) {
      setStats(result.stats);
    }
  };

  const handleUpdateUser = async () => {
    const result = await updateUser(selectedUser._id, editForm);

    if (result.success) {
      Alert.alert('Success', 'User updated successfully');
      setEditModalVisible(false);
      loadUsers();
      loadStats();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteUser(user._id);
            if (result.success) {
              Alert.alert('Success', 'User deleted successfully');
              loadUsers();
              loadStats();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      role: user.role,
      skills: user.skills?.join(', ') || '',
      location: user.location || '',
      phone: user.phone || ''
    });
    setEditModalVisible(true);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Access Denied. Admin privileges required.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>User Management</Text>

      <UserStatsCard stats={stats} />

      <UserFilters filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <AppLoader />
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onEdit={openEditModal}
              onDelete={handleDeleteUser}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No users found</Text>
          }
        />
      )}

      <Pagination
        currentPage={filters.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <UserEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        editForm={editForm}
        onFormChange={setEditForm}
        onSave={handleUpdateUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    // color: '#2c3e50', overridden
  },
  errorText: {
    textAlign: 'center',
    // color: '#e74c3c', overridden
    fontSize: 18,
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    // color: '#7f8c8d', overridden
    fontSize: 16,
    marginTop: 50,
  },
});

export default AdminUsersScreen;