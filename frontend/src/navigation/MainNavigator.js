import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import ReportDisasterScreen from '../screens/main/ReportDisasterScreen';
import ViewMapScreen from '../screens/main/ViewMapScreen';
import NotificationInboxScreen from '../screens/main/NotificationInboxScreen';

import ShelterListScreen from '../screens/shelter/ShelterListScreen';
import ShelterDetailScreen from '../screens/shelter/ShelterDetailScreen';
import AddShelterScreen from '../screens/shelter/AddShelterScreen';

import AdminNavigator from './AdminNavigator';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ShelterStack = createNativeStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    </ProfileStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen name="ReportDisaster" component={ReportDisasterScreen} options={{ title: 'Report Disaster' }} />
      <HomeStack.Screen name="ViewMap" component={ViewMapScreen} options={{ title: 'Disaster Map' }} />
      <HomeStack.Screen name="NotificationInbox" component={NotificationInboxScreen} options={{ title: 'Notifications' }} />
    </HomeStack.Navigator>
  );
}

function ShelterStackNavigator() {
  return (
    <ShelterStack.Navigator>
      <ShelterStack.Screen name="ShelterList" component={ShelterListScreen} options={{ title: 'Nearby Shelters' }} />
      <ShelterStack.Screen name="ShelterDetail" component={ShelterDetailScreen} options={{ title: 'Shelter Details' }} />
      <ShelterStack.Screen name="AddShelter" component={AddShelterScreen} options={{ title: 'Add New Shelter' }} />
    </ShelterStack.Navigator>
  );
}

export default function MainNavigator() {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Shelters') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Shelters" component={ShelterStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Map" component={ViewMapScreen} />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{ headerShown: false }}
        />
      )}
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
