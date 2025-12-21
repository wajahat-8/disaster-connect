import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import { useAuth } from '../../auth';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import { DisasterListItem, DisasterMapView } from './components';

const ManageDisastersScreen = ({ navigation }) => {
    const { isAdmin } = useAuth();
    const theme = useTheme();
    const [disasters, setDisasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        if (isAdmin) {
            loadDisasters();
        }
    }, [isAdmin]);

    const loadDisasters = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/disasters?limit=100');
            if (response.data.success) {
                setDisasters(response.data.disasters);
            }
        } catch (error) {
            console.error('Load disasters error:', error);
            Alert.alert('Error', 'Failed to load disasters');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = async (disasterId) => {
        try {
            const response = await apiClient.delete(`/disasters/${disasterId}`);
            if (response.data.success) {
                Alert.alert('Success', 'Disaster deleted successfully');
                loadDisasters();
            }
        } catch (error) {
            console.error('Delete disaster error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete disaster');
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDisasters();
    };

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied. Admin privileges required.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Manage Disasters</Text>

            <SegmentedButtons
                value={viewMode}
                onValueChange={setViewMode}
                buttons={[
                    { value: 'list', label: 'List', icon: 'view-list' },
                    { value: 'map', label: 'Map', icon: 'map' },
                ]}
                style={styles.segmentedButtons}
            />

            {loading ? (
                <AppLoader />
            ) : viewMode === 'list' ? (
                <FlatList
                    data={disasters}
                    renderItem={({ item }) => <DisasterListItem disaster={item} onDelete={handleDelete} />}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No disasters found</Text>
                    }
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <DisasterMapView disasters={disasters} onDelete={handleDelete} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#2c3e50',
    },
    segmentedButtons: {
        marginHorizontal: 15,
        marginBottom: 10,
    },
    listContent: {
        padding: 10,
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

export default ManageDisastersScreen;
