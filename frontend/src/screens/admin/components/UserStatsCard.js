import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from 'react-native-paper';

const UserStatsCard = ({ stats }) => {
    const theme = useTheme();
    if (!stats) return null;

    return (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>{stats.totalUsers}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>{stats.totalAdmins}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Admins</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>{stats.totalVolunteers}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Volunteers</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>{stats.recentRegistrations}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>New (7 days)</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        // color: '#2c3e50', overridden
    },
    statLabel: {
        fontSize: 12,
        // color: '#7f8c8d', overridden
        marginTop: 5,
    },
});

export default UserStatsCard;
