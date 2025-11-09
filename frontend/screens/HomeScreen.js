import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>
      
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>

        {/* Add more menu items for other modules */}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Disaster Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Shelter Finder</Text>
        </TouchableOpacity>

        {user?.role === 'volunteer' && (
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Volunteer Tasks</Text>
          </TouchableOpacity>
        )}

        {user?.role === 'admin' && (
          <>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Admin Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('AdminUsers')}
            >
              <Text style={styles.menuText}>User Management</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: '#e74c3c' }]}
          onPress={logout}
        >
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  role: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  menu: {
    gap: 15,
  },
  menuItem: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
