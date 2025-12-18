import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../auth';
import AppCard from '../../components/common/AppCard';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();

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
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Text
            size={45}
            label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
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
