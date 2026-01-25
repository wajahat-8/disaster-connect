import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Alert,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { Card, Chip, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../auth';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import AppButton from '../../components/common/AppButton';

const ManageSheltersScreen = ({ navigation }) => {
    const { isAdmin } = useAuth();
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            loadShelters();
        }
    }, [isAdmin]);

    const loadShelters = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/shelters');
            if (response.data.success) {
                setShelters(response.data.data);
            }
        } catch (error) {
            console.error('Load shelters error:', error);
            Alert.alert('Error', 'Failed to load shelters');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = async (shelterId) => {
        Alert.alert(
            'Delete Shelter',
            'Are you sure you want to delete this shelter?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiClient.delete(`/shelters/${shelterId}`);
                            Alert.alert('Success', 'Shelter deleted successfully');
                            loadShelters();
                        } catch (error) {
                            console.error('Delete shelter error:', error);
                            Alert.alert('Error', 'Failed to delete shelter');
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadShelters();
    };

    const renderShelter = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.header}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Chip
                        mode="flat"
                        style={[
                            styles.capacityChip,
                            { backgroundColor: item.currentOccupancy >= item.capacity ? '#e74c3c' : '#27ae60' },
                        ]}
                        textStyle={{ color: 'white', fontSize: 11 }}
                    >
                        {`${item.currentOccupancy}/${item.capacity}`}
                    </Chip>
                </View>

                <Text style={styles.address} numberOfLines={2}>
                    <Ionicons name="location" size={14} /> {item.address}
                </Text>

                <View style={styles.facilities}>
                    {item.facilities?.slice(0, 3).map((facility, index) => (
                        <Chip key={index} style={styles.facilityChip} textStyle={{ fontSize: 11, lineHeight: 12, marginVertical: 0 }} compact>
                            {facility}
                        </Chip>
                    ))}
                    {item.facilities?.length > 3 && (
                        <Chip style={styles.facilityChip} textStyle={{ fontSize: 11, lineHeight: 12, marginVertical: 0 }} compact>
                            {`+${item.facilities.length - 3} more`}
                        </Chip>
                    )}
                </View>

                <View style={styles.actions}>
                    <AppButton
                        mode="outlined"
                        text="View Details"
                        onPress={() => navigation.navigate('ShelterDetail', { shelterId: item._id })}
                        icon="eye"
                        contentStyle={{ height: 36 }}
                        labelStyle={{ fontSize: 12 }}
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <AppButton
                        mode="contained"
                        text="Delete"
                        onPress={() => handleDelete(item._id)}
                        buttonColor="#e74c3c"
                        icon="delete"
                        contentStyle={{ height: 36 }}
                        labelStyle={{ fontSize: 12 }}
                        style={{ flex: 1 }}
                    />
                </View>
            </View>
        </Card>
    );

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied. Admin privileges required.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Manage Shelters</Text>

            {loading ? (
                <AppLoader />
            ) : (
                <>
                    <FlatList
                        data={shelters}
                        renderItem={renderShelter}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={<Text style={styles.emptyText}>No shelters found</Text>}
                        contentContainerStyle={styles.listContent}
                    />
                    <FAB
                        style={styles.fab}
                        icon="plus"
                        label="Add Shelter"
                        onPress={() => navigation.navigate('AddShelter')}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#2c3e50',
    }, // Renamed from title to avoid duplicate
    listContent: {
        padding: 10,
    },
    card: {
        marginVertical: 6,
        elevation: 2,
    },
    cardContent: {
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
    },
    capacityChip: {
        marginLeft: 10,
    },
    address: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    facilities: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    facilityChip: {
        marginRight: 5,
        marginBottom: 5,
        height: 28,
        justifyContent: 'center', // Center vertically
        alignItems: 'center',    // Center horizontally
    },
    actions: {
        flexDirection: 'row',
        marginTop: 5,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#27ae60',
    },
    emptyText: {
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: 16,
        marginTop: 50,
    },
    errorText: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 18,
        marginTop: 50,
    },
});

export default ManageSheltersScreen;
