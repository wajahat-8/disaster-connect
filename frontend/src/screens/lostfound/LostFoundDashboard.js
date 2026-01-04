import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image, Alert } from 'react-native';
import { Text, FAB, Searchbar, SegmentedButtons, Avatar, useTheme, Chip, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getAllItems, deleteItem } from '../../api/lostFoundApi';
import { useAuth } from '../../auth/useAuth';
import AppLoader from '../../components/common/AppLoader';
import AppCard from '../../components/common/AppCard';

export default function LostFoundDashboard({ navigation }) {
    const theme = useTheme();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('all'); // 'all', 'lost', 'found'
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchItems = async () => {
        try {
            const params = { search: searchQuery };
            if (viewMode !== 'all') {
                params.status = viewMode;
            }
            const data = await getAllItems(params);
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchItems();
        }, [viewMode]) // Re-fetch when view mode changes
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchItems();
    };

    const handleSearch = () => {
        setLoading(true);
        fetchItems();
    };

    const handleDelete = async (itemId, itemName) => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to delete "${itemName}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await deleteItem(itemId);
                            if (result.success) {
                                // Refresh the list
                                fetchItems();
                            }
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', error.response?.data?.error || 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <AppCard style={styles.card} onPress={() => { /* Navigate to detail if needed */ }}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <Avatar.Icon size={32} icon="account" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
                    <View style={{ marginLeft: 8 }}>
                        <Text variant="labelLarge">{item.reporterId?.name || 'Unknown'}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {new Date(item.date).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.cardHeaderRight}>
                    <Chip
                        icon={item.status === 'lost' ? 'help-circle' : 'check-circle'}
                        style={{ backgroundColor: item.status === 'lost' ? theme.colors.errorContainer : theme.colors.secondaryContainer, height: 28 }}
                        textStyle={{ color: item.status === 'lost' ? theme.colors.error : theme.colors.secondary, fontSize: 12, marginVertical: 0, lineHeight: 14 }}
                    >
                        {item.status.toUpperCase()}
                    </Chip>
                    {user && item.reporterId?._id === user._id && (
                        <IconButton
                            icon="delete"
                            size={20}
                            iconColor={theme.colors.error}
                            onPress={() => handleDelete(item._id, item.itemName)}
                            style={{ margin: 0 }}
                        />
                    )}
                </View>
            </View>

            <Text variant="titleMedium" style={styles.title}>{item.itemName}</Text>
            <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                {item.description}
            </Text>

            {item.location && item.location.address && (
                <View style={styles.locationContainer}>
                    <Avatar.Icon size={20} icon="map-marker" style={{ backgroundColor: 'transparent' }} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>{item.location.address}</Text>
                </View>
            )}

            {item.image && item.image !== 'no-photo.jpg' && (
                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            )}
        </AppCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search lost or found items..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    onSubmitEditing={handleSearch}
                    style={styles.searchBar}
                />
                <SegmentedButtons
                    value={viewMode}
                    onValueChange={setViewMode}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'lost', label: 'Lost' },
                        { value: 'found', label: 'Found' },
                    ]}
                    style={styles.segments}
                />
            </View>

            {loading && !refreshing ? (
                <AppLoader visible={true} overlay />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text>No items found.</Text>
                        </View>
                    }
                />
            )}

            <View style={styles.fabContainer}>
                <FAB
                    icon="hand-heart"
                    label="Found"
                    style={[styles.miniFab, { marginBottom: 16, backgroundColor: theme.colors.secondaryContainer }]}
                    color={theme.colors.onSecondaryContainer}
                    onPress={() => navigation.navigate('ReportFoundItem')}
                />
                <FAB
                    icon="help"
                    label="Lost"
                    style={[styles.miniFab, { backgroundColor: theme.colors.errorContainer }]}
                    color={theme.colors.onErrorContainer}
                    onPress={() => navigation.navigate('ReportLostItem')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        elevation: 2,
    },
    searchBar: {
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
    },
    segments: {
        marginBottom: 0,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, // Space for FABs
    },
    card: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 8
    },
    cardImage: {
        marginTop: 8,
        height: 150,
        borderRadius: 8,
        width: '100%'
    },
    fabContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        alignItems: 'flex-end',
    },
    miniFab: {
        // marginVertical: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50
    }
});
