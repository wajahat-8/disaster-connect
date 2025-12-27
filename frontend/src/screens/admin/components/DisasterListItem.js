import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme, Card, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../../components/common/AppButton';

const DisasterListItem = ({ disaster, onDelete }) => {
    const theme = useTheme();
    const handleDelete = () => {
        Alert.alert(
            'Delete Disaster Report',
            `Are you sure you want to delete this ${disaster.type} report?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(disaster._id),
                },
            ]
        );
    };

    // Severity colors now from theme
    const getSeverityColor = (severity) => theme.colors.severity[severity] || theme.colors.severity.low;

    const typeIcons = {
        flood: 'water',
        earthquake: 'pulse',
        fire: 'flame',
        storm: 'thunderstorm',
        landslide: 'trending-down',
        other: 'alert-circle',
    };

    return (
        <Card style={styles.card}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Ionicons
                            name={typeIcons[disaster.type] || 'alert-circle'}
                            size={24}
                            color={getSeverityColor(disaster.severity)}
                        />
                        <Text style={[styles.type, { color: theme.colors.textPrimary }]}>{disaster.type.toUpperCase()}</Text>
                    </View>
                    <Chip
                        style={[styles.severityChip, { backgroundColor: getSeverityColor(disaster.severity) }]}
                        textStyle={{
                            color: 'white',
                            fontSize: 11,
                            lineHeight: 12,
                            marginVertical: 0,
                            marginHorizontal: 4
                        }}
                        compact
                    >
                        {disaster.severity ? disaster.severity.toUpperCase() : 'UNKNOWN'}
                    </Chip>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {disaster.description}
                </Text>

                <View style={styles.meta}>
                    <View style={styles.metaLocationContainer}>
                        <Ionicons name="location" size={12} color="#7f8c8d" style={{ marginRight: 4, marginTop: 2 }} />
                        <Text style={styles.metaTextLocation}>
                            {disaster.location?.address || 'No address'}
                        </Text>
                    </View>
                    <View style={styles.metaDateContainer}>
                        <Ionicons name="calendar" size={12} color="#7f8c8d" style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>
                            {new Date(disaster.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <AppButton
                        mode="contained"
                        text="Delete"
                        onPress={handleDelete}
                        buttonColor={theme.colors.error}
                        icon="delete"
                        contentStyle={{ height: 36 }}
                        labelStyle={{ fontSize: 12 }}
                    />
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 6,
        marginHorizontal: 4,
        elevation: 2,
    },
    content: {
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    type: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginLeft: 8,
    },
    severityChip: {
        height: 28, // Increased height
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 14,
        color: '#34495e', // Can override with theme.colors.textPrimary if passed
        marginBottom: 10,
        lineHeight: 20,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    metaLocationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: 10,
    },
    metaDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
    },
    metaTextLocation: {
        fontSize: 12,
        color: '#7f8c8d',
        flex: 1,
        flexShrink: 1, // Explicitly allow shrinking
    },
    metaText: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    actions: {
        marginTop: 5,
    },
});

export default DisasterListItem;
