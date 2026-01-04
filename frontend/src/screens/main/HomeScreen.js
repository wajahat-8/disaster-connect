import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Text, Avatar, useTheme, Chip, Badge } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../auth';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import AppCard from '../../components/common/AppCard';
import { getAllItems } from '../../api/lostFoundApi';
import { getNearbyDisasters } from '../../api/disasterApi';
import apiClient from '../../api/apiClient';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [nearbyDisasters, setNearbyDisasters] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // Listen for dimension changes (orientation, window resize)
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadUnreadCount();
      loadRecentItems();
      loadNearbyDisasters();
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

  const loadRecentItems = async () => {
    try {
      const data = await getAllItems({ limit: 5 });
      if (data.success) {
        setRecentItems(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent items:', error);
    }
  };

  const loadNearbyDisasters = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const data = await getNearbyDisasters(latitude, longitude, 50);
      if (data.success) {
        setNearbyDisasters(data.disasters || []);
      }
    } catch (error) {
      console.error('Error loading nearby disasters:', error);
    }
  };

  const getDisasterIcon = (type) => {
    const icons = {
      flood: { name: 'water', color: '#2196F3' },
      earthquake: { name: 'earth', color: '#795548' },
      fire: { name: 'fire', color: '#FF5722' },
      storm: { name: 'weather-lightning', color: '#9C27B0' },
      landslide: { name: 'terrain', color: '#8D6E63' },
      other: { name: 'alert-circle', color: '#FF9800' }
    };
    return icons[type?.toLowerCase()] || icons.other;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#f44336',
      critical: '#9C27B0'
    };
    return colors[severity?.toLowerCase()] || colors.medium;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
    {
      title: 'Lost & Found',
      subtitle: 'Report or find missing items',
      icon: 'search',
      color: '#FF9800',
      route: 'Lost & Found'
    },
    {
      title: 'Donate',
      subtitle: 'Support relief efforts',
      icon: 'heart',
      color: '#9C27B0',
      route: 'Donate'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text variant="titleLarge" style={styles.greeting}>Hello, {user?.name}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.textSecondary || '#757575' }}>Stay safe and connected.</Text>
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
                    backgroundColor: theme.colors.error
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

        {/* Nearby Disasters Alert Section */}
        {nearbyDisasters.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleRow}>
                <Ionicons name="warning" size={22} color={theme.colors.error} />
                <Text variant="titleMedium" style={[styles.alertTitle, { color: theme.colors.error }]}>
                  Nearby Alerts ({nearbyDisasters.length})
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ViewMap')}>
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>View Map</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              {nearbyDisasters.map((disaster) => {
                const iconData = getDisasterIcon(disaster.disasterType);
                return (
                  <TouchableOpacity
                    key={disaster._id}
                    onPress={() => navigation.navigate('ViewMap', { focusDisaster: disaster })}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.disasterCard, { backgroundColor: theme.colors.errorContainer }]}>
                      <View style={styles.disasterCardHeader}>
                        <View style={[styles.disasterIconContainer, { backgroundColor: iconData.color + '20' }]}>
                          <MaterialCommunityIcons name={iconData.name} size={24} color={iconData.color} />
                        </View>
                        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(disaster.severity) + '30' }]}>
                          <Text style={[styles.severityText, { color: getSeverityColor(disaster.severity) }]}>
                            {disaster.severity?.toUpperCase() || 'ALERT'}
                          </Text>
                        </View>
                      </View>
                      <Text variant="titleSmall" numberOfLines={1} style={styles.disasterType}>
                        {disaster.disasterType || 'Disaster'}
                      </Text>
                      <Text variant="bodySmall" numberOfLines={2} style={styles.disasterLocation}>
                        {disaster.location?.address || 'Location unavailable'}
                      </Text>
                      <Text variant="labelSmall" style={styles.disasterTime}>
                        {getTimeAgo(disaster.createdAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Menu Grid */}
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <AppCard
              key={index}
              mode="elevated"
              onPress={() => {
                if (item.route === 'ShelterList') {
                  navigation.navigate('Shelters');
                } else if (item.route === 'Lost & Found') {
                  navigation.navigate('Lost & Found');
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

        {/* Recent Lost & Found */}
        {recentItems.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Recent Lost & Found</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Lost & Found')}>
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              {recentItems.map((item) => (
                <AppCard
                  key={item._id}
                  onPress={() => navigation.navigate('Lost & Found')}
                  style={styles.itemCard}
                  contentStyle={{ padding: 10 }}
                >
                  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Chip
                      icon={item.status === 'lost' ? 'help-circle' : 'check-circle'}
                      style={{ backgroundColor: item.status === 'lost' ? '#ffebee' : '#e8f5e9', height: 26 }}
                      textStyle={{ color: item.status === 'lost' ? theme.colors.error : 'green', fontSize: 10, marginVertical: 0, lineHeight: 12 }}
                    >
                      {item.status.toUpperCase()}
                    </Chip>
                  </View>
                  <Text variant="labelLarge" numberOfLines={1}>{item.itemName}</Text>
                  <Text variant="bodySmall" numberOfLines={1} style={{ color: 'gray' }}>
                    {item.location?.address || 'No location'}
                  </Text>
                </AppCard>
              ))}
            </ScrollView>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontWeight: 'bold',
  },
  alertSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontWeight: 'bold',
  },
  disasterCard: {
    width: 180,
    padding: 14,
    borderRadius: 12,
    marginRight: 12,
  },
  disasterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  disasterIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  disasterType: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  disasterLocation: {
    color: '#666',
    marginBottom: 6,
  },
  disasterTime: {
    color: '#999',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 150,
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
  },
  itemCard: {
    width: 160,
    marginRight: 15,
    borderRadius: 12
  }
});

export default HomeScreen;
