import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserStatsCard = ({ stats }) => {
    if (!stats) return null;

    return (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalAdmins}</Text>
                <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalVolunteers}</Text>
                <Text style={styles.statLabel}>Volunteers</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.recentRegistrations}</Text>
                <Text style={styles.statLabel}>New (7 days)</Text>
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
        color: '#2c3e50',
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 5,
    },
});

export default UserStatsCard;
