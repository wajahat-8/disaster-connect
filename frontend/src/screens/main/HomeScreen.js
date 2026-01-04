import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Text, Avatar, useTheme, Chip, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../auth';
import { useFocusEffect } from '@react-navigation/native';
import AppCard from '../../components/common/AppCard';
import { getAllItems } from '../../api/lostFoundApi';
import apiClient from '../../api/apiClient';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
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
      // Fetch latest 5 items
      const data = await getAllItems({ limit: 5 });
      if (data.success) {
        setRecentItems(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent items:', error);
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

  // Calculate number of columns based on screen width
  const getColumnCount = () => {
    if (dimensions.width >= 768) return 3; // Tablet
    if (dimensions.width >= 600) return 3; // Large phone landscape
    return 2; // Phone portrait
  };

  const columnCount = getColumnCount();
  const cardWidth = `${(100 / columnCount) - 4}%`; // Subtract 4% for margins

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={{ flex: 1 }}>
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



        {/* Menu Grid */}
        <View style={styles.gridContainer}>
          {console.log('Rendering menu items:', menuItems.length)}
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
