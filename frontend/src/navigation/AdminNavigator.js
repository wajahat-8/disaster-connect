import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth';
import { useTheme } from 'react-native-paper';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageDisastersScreen from '../screens/admin/ManageDisastersScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import SendNotificationScreen from '../screens/admin/SendNotificationScreen';
import ManageSheltersScreen from '../screens/admin/ManageSheltersScreen';
import ManageLostFoundScreen from '../screens/admin/ManageLostFoundScreen';
import DonationsListScreen from '../screens/admin/DonationsListScreen';

// Shelter Screens (for detail view from ManageSheltersScreen)
import ShelterDetailScreen from '../screens/shelter/ShelterDetailScreen';
import AddShelterScreen from '../screens/shelter/AddShelterScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
    const theme = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Admin Dashboard' }}
            />
            <Stack.Screen
                name="ManageDisasters"
                component={ManageDisastersScreen}
                options={{ title: 'Manage Disasters' }}
            />
            <Stack.Screen
                name="ManageUsers"
                component={AdminUsersScreen}
                options={{ title: 'Manage Users' }}
            />
            <Stack.Screen
                name="SendNotification"
                component={SendNotificationScreen}
                options={{ title: 'Send Notification' }}
            />
            <Stack.Screen
                name="ManageShelters"
                component={ManageSheltersScreen}
                options={{ title: 'Manage Shelters' }}
            />
            <Stack.Screen
                name="ManageLostFound"
                component={ManageLostFoundScreen}
                options={{ title: 'Manage Lost & Found' }}
            />
            <Stack.Screen
                name="ManageDonations"
                component={DonationsListScreen}
                options={{ title: 'Manage Donations' }}
            />
            <Stack.Screen
                name="ShelterDetail"
                component={ShelterDetailScreen}
                options={{ title: 'Shelter Details' }}
            />
            <Stack.Screen
                name="AddShelter"
                component={AddShelterScreen}
                options={{ title: 'Add Shelter' }}
            />
        </Stack.Navigator>
    );
}
