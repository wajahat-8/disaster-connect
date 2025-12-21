import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../../components/common/AppButton';

const DisasterListItem = ({ disaster, onDelete }) => {
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

    const severityColor = {
        low: '#27ae60',
        medium: '#f39c12',
        high: '#e67e22',
        critical: '#e74c3c',
    };

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
                            color={severityColor[disaster.severity]}
                        />
                        <Text style={styles.type}>{disaster.type.toUpperCase()}</Text>
                    </View>
                    <Chip
                        style={[styles.severityChip, { backgroundColor: severityColor[disaster.severity] }]}
                        textStyle={{ color: 'white', fontSize: 11 }}
                    >
                        {disaster.severity}
                    </Chip>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {disaster.description}
                </Text>

                <View style={styles.meta}>
                    <Text style={styles.metaText}>
                        <Ionicons name="location" size={12} /> {disaster.location?.address || 'No address'}
                    </Text>
                    <Text style={styles.metaText}>
                        <Ionicons name="calendar" size={12} />{' '}
                        {new Date(disaster.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <AppButton
                        mode="contained"
                        text="Delete"
                        onPress={handleDelete}
                        buttonColor="#e74c3c"
                        icon="trash"
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
        height: 24,
    },
    description: {
        fontSize: 14,
        color: '#34495e',
        marginBottom: 10,
        lineHeight: 20,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
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
