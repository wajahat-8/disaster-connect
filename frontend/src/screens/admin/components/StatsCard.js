import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const StatsCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    const iconColor = color || theme.colors.primary; // Default to theme primary if no color passed
    return (
        <Card style={styles.card}>
            <View style={styles.content}>
                <Ionicons name={icon} size={32} color={iconColor} />
                <View style={styles.textContainer}>
                    <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{value}</Text>
                    <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 5,
        elevation: 2,
    },
    content: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    value: {
        fontSize: 28,
        fontWeight: 'bold',
        // color: '#2c3e50', overridden
    },
    title: {
        fontSize: 12,
        // color: '#7f8c8d', overridden
        marginTop: 5,
        textAlign: 'center',
    },
});

export default StatsCard;
