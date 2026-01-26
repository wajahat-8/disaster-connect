import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
    Image,
} from 'react-native';
import { Text, Searchbar, SegmentedButtons, useTheme, IconButton, Chip, Avatar } from 'react-native-paper';
import { getImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../auth';
import { getAllItems } from '../../api/lostFoundApi';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import AppCard from '../../components/common/AppCard';

const ManageLostFoundScreen = () => {
    const { isAdmin } = useAuth();
    const theme = useTheme();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'lost', 'found'


    useEffect(() => {
        if (isAdmin) {
            loadItems();
        }
    }, [isAdmin, filterStatus]);

    const loadItems = async () => {
        try {
            setLoading(true);
            const params = { search: searchQuery };
            if (filterStatus !== 'all') {
                params.status = filterStatus;
            }
            const data = await getAllItems(params);
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error('Load items error:', error);
            Alert.alert('Error', 'Failed to load items');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = async (itemId, itemName) => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to delete "${itemName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await apiClient.delete(`/lost-found/admin/${itemId}`);
                            if (response.data.success) {
                                Alert.alert('Success', 'Item deleted successfully');
                                loadItems();
                            }
                        } catch (error) {
                            console.error('Delete item error:', error);
                            Alert.alert('Error', error.response?.data?.error || 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const handleSearch = () => {
        loadItems();
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadItems();
    };

    const renderItem = ({ item }) => (
        <AppCard style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <Avatar.Icon
                        size={32}
                        icon="account"
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                        color={theme.colors.onPrimaryContainer}
                    />
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
                        style={{
                            backgroundColor: item.status === 'lost'
                                ? theme.colors.errorContainer
                                : theme.colors.secondaryContainer,
                            height: 28
                        }}
                        textStyle={{
                            color: item.status === 'lost'
                                ? theme.colors.error
                                : theme.colors.secondary,
                            fontSize: 12,
                            marginVertical: 0,
                            lineHeight: 14
                        }}
                    >
                        {item.status.toUpperCase()}
                    </Chip>
                    <IconButton
                        icon="delete"
                        size={20}
                        iconColor={theme.colors.error}
                        onPress={() => handleDelete(item._id, item.itemName)}
                        style={{ margin: 0 }}
                    />
                </View>
            </View>

            <Text variant="titleMedium" style={styles.title}>{item.itemName}</Text>
            <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                {item.description}
            </Text>

            {item.location && item.location.address && (
                <View style={styles.locationContainer}>
                    <Avatar.Icon
                        size={20}
                        icon="map-marker"
                        style={{ backgroundColor: 'transparent' }}
                        color={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
                        {item.location.address}
                    </Text>
                </View>
            )}

            {/* Contact Info */}
            {item.contactInfo && (item.contactInfo.phone || item.contactInfo.email) && (
                <View style={{ marginTop: 8, padding: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8 }}>
                    {item.contactInfo.phone && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <Avatar.Icon size={18} icon="phone" style={{ backgroundColor: 'transparent' }} color={theme.colors.primary} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginLeft: 4 }}>{item.contactInfo.phone}</Text>
                        </View>
                    )}
                    {item.contactInfo.email && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Icon size={18} icon="email" style={{ backgroundColor: 'transparent' }} color={theme.colors.primary} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginLeft: 4 }}>{item.contactInfo.email}</Text>
                        </View>
                    )}
                </View>
            )}

            {item.image && item.image !== 'no-photo.jpg' && (() => {
                const imageUrl = getImageUrl(item.image);
                return imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.cardImage}
                        resizeMode="cover"
                        onError={(error) => {
                            if (__DEV__) {
                                console.error('Image load error:', error.nativeEvent.error, 'for URL:', imageUrl);
                            }
                        }}
                    />
                ) : null;
            })()}
        </AppCard>
    );

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    Access Denied. Admin privileges required.
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Manage Lost & Found</Text>

            <View style={styles.header}>
                <Searchbar
                    placeholder="Search items..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    onSubmitEditing={handleSearch}
                    style={styles.searchBar}
                />
                <SegmentedButtons
                    value={filterStatus}
                    onValueChange={setFilterStatus}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
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
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 50,
    },
});

export default ManageLostFoundScreen;
