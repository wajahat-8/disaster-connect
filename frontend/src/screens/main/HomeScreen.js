import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme, Chip, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../auth';
import { useFocusEffect } from '@react-navigation/native';
import AppCard from '../../components/common/AppCard';
import apiClient from '../../api/apiClient';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadUnreadCount();
    }, [])
  );

  const loadUnreadCount = async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const menuItems = [
    {
      title: 'Report Disaster',
      subtitle: 'Notify authorities about an incident',
      icon: 'alert-circle',
      color: '#FF5252',
      route: 'ReportDisaster'
    },
    {
      title: 'Find Shelter',
      subtitle: 'Locate nearby safe zones',
      icon: 'home',
      color: '#4CAF50',
      route: 'ShelterList'
    },
    {
      title: 'View Map',
      subtitle: 'See affected areas live',
      icon: 'map',
      color: '#2196F3',
      route: 'ViewMap'
    },
    // Volunteer screen not yet implemented
    // {
    //   title: 'Volunteer',
    //   subtitle: 'Sign up to help others',
    //   icon: 'hand-left',
    //   color: '#FF9800',
    //   route: 'VolunteerValues'
    // }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.greeting}>Hello, {user?.name}</Text>
          <Text variant="bodyMedium" style={{ color: 'gray' }}>Stay safe and connected.</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          {/* Notification Bell */}
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationInbox')}
            style={{ position: 'relative' }}
          >
            <Ionicons name="notifications-outline" size={28} color={theme.colors.primary} />
            {unreadCount > 0 && (
              <Badge
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: '#FF5252'
                }}
                size={18}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Text
              size={45}
              label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
              style={{ backgroundColor: theme.colors.primaryContainer }}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats or Status (Optional) */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Chip icon="check-circle" style={{ backgroundColor: '#E8F5E9' }} textStyle={{ color: '#2E7D32' }}>
          System Operational
        </Chip>
      </View>

      {/* Menu Grid */}
      <View style={styles.gridContainer}>
        {menuItems.map((item, index) => (
          <AppCard
            key={index}
            mode="elevated"
            onPress={() => {
              // Special handling for cross-stack navigation
              if (item.route === 'ShelterList') {
                // Navigate to Shelters tab which contains ShelterList
                navigation.navigate('Shelters');
              } else {
                navigation.navigate(item.route);
              }
            }}
            style={styles.card}
            contentStyle={styles.cardContent}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={32} color={item.color} />
            </View>
            <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
            <Text variant="bodySmall" style={styles.cardSubtitle}>{item.subtitle}</Text>
          </AppCard>
        ))}
      </View>

      {/* Recent Alerts (Example) */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text variant="titleMedium" style={{ marginBottom: 10, fontWeight: 'bold' }}>Recent Updates</Text>
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Weather Warning</Text>
              <Text variant="bodySmall">Heavy rains expected in the northern district.</Text>
            </View>
          </View>
        </AppCard>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 16,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSubtitle: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 4,
  }
});

export default HomeScreen;
