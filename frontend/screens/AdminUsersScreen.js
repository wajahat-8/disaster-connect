import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const AdminUsersScreen = () => {
  const { getAllUsers, updateUser, deleteUser, getUserStats, isAdmin } = useAuth();
  
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

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <Text style={[styles.roleBadge, styles[`role${item.role}`]]}>
            {item.role.toUpperCase()}
          </Text>
          <Text style={styles.date}>
            Joined: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {item.skills && item.skills.length > 0 && (
          <Text style={styles.skills}>Skills: {item.skills.join(', ')}</Text>
        )}
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        {item.role !== 'admin' && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteUser(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access Denied. Admin privileges required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      {/* Statistics */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalAdmins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalVolunteers}</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.recentRegistrations}</Text>
            <Text style={styles.statLabel}>New (7 days)</Text>
          </View>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={filters.search}
          onChangeText={(text) => setFilters({ ...filters, search: text, page: 1 })}
        />
        
        <View style={styles.roleFilters}>
          {['all', 'user', 'volunteer', 'admin'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleFilter,
                filters.role === role && styles.roleFilterActive
              ]}
              onPress={() => setFilters({ ...filters, role, page: 1 })}
            >
              <Text style={[
                styles.roleFilterText,
                filters.role === role && styles.roleFilterTextActive
              ]}>
                {role.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Users List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              filters.page === 1 && styles.paginationButtonDisabled
            ]}
            onPress={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          
          <Text style={styles.paginationInfo}>
            Page {filters.page} of {pagination.totalPages}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.paginationButton,
              filters.page === pagination.totalPages && styles.paginationButtonDisabled
            ]}
            onPress={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === pagination.totalPages}
          >
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit User Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            
            <ScrollView style={styles.modalForm}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              />
              
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleOptions}>
                {['user', 'volunteer', 'admin'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      editForm.role === role && styles.roleOptionSelected
                    ]}
                    onPress={() => setEditForm({ ...editForm, role })}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      editForm.role === role && styles.roleOptionTextSelected
                    ]}>
                      {role.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Skills (comma separated)"
                value={editForm.skills}
                onChangeText={(text) => setEditForm({ ...editForm, skills: text })}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={editForm.location}
                onChangeText={(text) => setEditForm({ ...editForm, location: text })}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateUser}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: '#2c3e50',
  },
  errorText: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 18,
    marginTop: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  roleFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleFilter: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  roleFilterActive: {
    backgroundColor: '#3498db',
  },
  roleFilterText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  roleFilterTextActive: {
    color: '#fff',
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 10,
  },
  roleuser: {
    backgroundColor: '#d5dbdb',
    color: '#2c3e50',
  },
  rolevolunteer: {
    backgroundColor: '#f39c12',
    color: '#fff',
  },
  roleadmin: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  date: {
    fontSize: 12,
    color: '#95a5a6',
  },
  skills: {
    fontSize: 12,
    color: '#34495e',
    marginTop: 5,
    fontStyle: 'italic',
  },
  userActions: {
    flexDirection: 'row',
    gap: 5,
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
    marginTop: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  paginationButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  paginationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationInfo: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalForm: {
    maxHeight: 400,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  roleOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    alignItems: 'center',
  },
  roleOptionSelected: {
    backgroundColor: '#3498db',
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  roleOptionTextSelected: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminUsersScreen;