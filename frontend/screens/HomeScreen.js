import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Avatar, Card, useTheme, Chip, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const menuItems = [
    { key: 'profile', label: 'My Profile', icon: 'person-outline', onPress: () => navigation.navigate('Profile') },
    { key: 'report', label: 'Report Disaster', icon: 'alert-circle-outline', onPress: () => navigation.navigate('ReportDisaster') },
    { key: 'map', label: 'View Disaster Map', icon: 'map-outline', onPress: () => navigation.navigate('ViewMap') },
    { key: 'shelters', label: 'Shelter Finder', icon: 'location-outline', onPress: () => { } },
  ];

  if (user?.role === 'volunteer') {
    menuItems.push({ key: 'voltasks', label: 'Volunteer Tasks', icon: 'hand-left-outline', onPress: () => { } });
  }

  if (user?.role === 'admin') {
    menuItems.push({ key: 'admin', label: 'Admin Dashboard', icon: 'speedometer-outline', onPress: () => { } });
    menuItems.push({ key: 'users', label: 'User Management', icon: 'people-outline', onPress: () => navigation.navigate('AdminUsers') });
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text
            size={50}
            label={(user?.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
          <View style={styles.texts}>
            <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>Welcome back,</Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{user?.name || 'User'}</Text>
          </View>
        </View>
        <IconButton
          icon="logout"
          size={24}
          iconColor={theme.colors.error}
          onPress={logout}
          style={{ margin: 0 }}
        />
      </View>

      <View style={styles.roleContainer}>
        <Chip icon="account-check" style={{ backgroundColor: theme.colors.secondaryContainer }}>
          Role: {(user?.role || 'User').toUpperCase()}
        </Chip>
      </View>

      {/* Grid Menu */}
      <View style={styles.grid}>
        {menuItems.map(item => (
          <Card
            key={item.key}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={item.key === 'logout' ? logout : item.onPress}
            mode="elevated"
          >
            <Card.Content style={styles.cardContent}>
              <Ionicons
                name={item.icon}
                size={32}
                color={item.key === 'logout' ? theme.colors.error : theme.colors.primary}
                style={{ marginBottom: 10 }}
              />
              <Text
                variant="labelLarge"
                style={{
                  textAlign: 'center',
                  color: item.key === 'logout' ? theme.colors.error : theme.colors.onSurface
                }}
              >
                {item.label}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texts: {
    marginLeft: 15,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    marginBottom: 12,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default HomeScreen;
