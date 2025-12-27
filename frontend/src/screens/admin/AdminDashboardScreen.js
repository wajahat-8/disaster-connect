import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../../auth';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import { StatsCard, AdminMenuButton } from './components';

const AdminDashboardScreen = ({ navigation }) => {
    const { isAdmin } = useAuth();
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            loadStats();
        }
    }, [isAdmin]);

    const loadStats = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/users/stats');
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Load stats error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadStats();
    };

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>Access Denied. Admin privileges required.</Text>
            </View>
        );
    }

    if (loading) {
        return <AppLoader />;
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={[styles.title, { color: theme.colors.primary }]}>Admin Dashboard</Text>

            {/* Statistics Cards */}
            <View style={styles.statsRow}>
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon="people"
                    color={theme.colors.primary}
                />
                <StatsCard
                    title="Volunteers"
                    value={stats?.totalVolunteers || 0}
                    icon="heart"
                    color="#27ae60"
                />
            </View>
            <View style={styles.statsRow}>
                <StatsCard
                    title="Active Disasters"
                    value={stats?.activeDisasters || 0}
                    icon="warning"
                    color={theme.colors.secondary}
                />
                <StatsCard
                    title="Admins"
                    value={stats?.totalAdmins || 0}
                    icon="shield-checkmark"
                    color="#9b59b6"
                />
            </View>

            {/* Management Buttons */}
            <View style={styles.menuContainer}>
                <AdminMenuButton
                    title="Manage Disasters"
                    subtitle="View and delete disaster reports"
                    icon="alert-circle"
                    color={theme.colors.secondary}
                    onPress={() => navigation.navigate('ManageDisasters')}
                />
                <AdminMenuButton
                    title="Manage Users"
                    subtitle="View, edit, and delete users"
                    icon="people"
                    color={theme.colors.primary}
                    onPress={() => navigation.navigate('ManageUsers')}
                />
                <AdminMenuButton
                    title="Send Notifications"
                    subtitle="Broadcast alerts to users"
                    icon="notifications"
                    color="#f39c12"
                    onPress={() => navigation.navigate('SendNotification')}
                />
                <AdminMenuButton
                    title="Manage Shelters"
                    subtitle="View and manage shelters"
                    icon="home"
                    color={theme.colors.primaryContainer}
                    onPress={() => navigation.navigate('ManageShelters')}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        // color: '#2c3e50', overridden in component
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    menuContainer: {
        padding: 15,
        marginTop: 10,
    },
    errorText: {
        textAlign: 'center',
        color: '#e74c3c', // Could use theme.colors.error but this is style sheet. 
        // Best to use inline style for theme color: style={[styles.errorText, { color: theme.colors.error }]}
        fontSize: 18,
        marginTop: 50,
    },
});

export default AdminDashboardScreen;
