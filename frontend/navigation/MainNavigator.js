import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    </ProfileStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}




