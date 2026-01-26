import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image, Alert, SafeAreaView } from 'react-native';
import { Text, FAB, Searchbar, SegmentedButtons, Avatar, useTheme, Chip, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getAllItems, deleteItem } from '../../api/lostFoundApi';
import { useAuth } from '../../auth/useAuth';
import AppLoader from '../../components/common/AppLoader';
import AppCard from '../../components/common/AppCard';
import { getImageUrl } from '../../utils/imageUtils';

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
        <AppCard style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={() => { /* Navigate to detail if needed */ }}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <Avatar.Icon size={32} icon="account" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
                    <View style={{ marginLeft: 8 }}>
                        <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>{item.reporterId?.name || 'Unknown'}</Text>
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

            <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>{item.itemName}</Text>
            <Text variant="bodyMedium" numberOfLines={2} style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                {item.description}
            </Text>

            {item.location && item.location.address && (
                <View style={styles.locationContainer}>
                    <Avatar.Icon size={20} icon="map-marker" style={{ backgroundColor: 'transparent' }} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>{item.location.address}</Text>
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant, borderBottomWidth: 1 }]}>
                <Searchbar
                    placeholder="Search lost or found items..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    onSubmitEditing={handleSearch}
                    style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
                    inputStyle={{ color: theme.colors.onSurfaceVariant }}
                    iconColor={theme.colors.onSurfaceVariant}
                    placeholderTextColor={theme.colors.onSurfaceVariant}
                    elevation={0}
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
                    theme={theme}
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
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        elevation: 0, // Handled by border
    },
    searchBar: {
        marginBottom: 12,
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
