import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Text
} from 'react-native';
import { Chip, SegmentedButtons, useTheme, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import AppCard from '../../components/common/AppCard';

const NotificationInboxScreen = ({ navigation }) => {
    const theme = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadNotifications();
    }, [filter]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/notifications/inbox', {
                params: { filter, page: 1, limit: 50 }
            });

            if (response.data.success) {
                setNotifications(response.data.data.notifications);
                setUnreadCount(response.data.data.unreadCount);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId
                        ? { ...notif, isRead: true, readAt: new Date() }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // API call in background
            await apiClient.patch(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error('Error marking as read:', error);
            // Revert on error would be here, but for read status it's low risk
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            // Optimistic update
            const notificationToDelete = notifications.find(n => n._id === notificationId);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));

            if (!notificationToDelete?.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            await apiClient.delete(`/notifications/${notificationId}`);
        } catch (error) {
            console.error('Error deleting notification:', error);
            loadNotifications(); // Reload on error
            alert('Failed to delete notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.patch('/notifications/read-all');
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadNotifications();
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'emergency':
            case 'disaster':
                return { name: 'alert-circle', color: '#e74c3c' };
            case 'shelter':
                return { name: 'business', color: '#2980b9' };
            case 'volunteer':
                return { name: 'people', color: '#27ae60' };
            case 'system':
                return { name: 'settings', color: '#7f8c8d' };
            default:
                return { name: 'notifications', color: theme.colors.primary };
        }
    };

    const renderNotification = ({ item }) => {
        const icon = getNotificationIcon(item.type);
        return (
            <TouchableOpacity
                onPress={() => !item.isRead && handleMarkAsRead(item._id)}
                activeOpacity={0.7}
            >
                <AppCard
                    style={[
                        styles.card,
                        { backgroundColor: item.isRead ? theme.colors.background : theme.colors.surface },
                        !item.isRead && { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }
                    ]}
                    contentStyle={styles.cardContent}
                >
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={icon.name} size={24} color={icon.color} />
                        </View>
                        <View style={styles.titleColumn}>
                            <View style={styles.titleRow}>
                                <Text
                                    style={[
                                        styles.title,
                                        !item.isRead && styles.unreadTitle
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
                                    <TouchableOpacity
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        onPress={() => handleDelete(item._id)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.body} numberOfLines={2}>
                                {item.body}
                            </Text>
                        </View>
                    </View>

                </AppCard>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) {
        return <AppLoader />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.controls}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'unread', label: unreadCount > 0 ? `Unread (${unreadCount})` : 'Unread' },
                        { value: 'read', label: 'Read' }
                    ]}
                    style={styles.segmentedButtons}
                    theme={{
                        colors: {
                            secondaryContainer: theme.colors.primaryContainer,
                            onSecondaryContainer: theme.colors.onPrimaryContainer,
                        }
                    }}
                />

                {unreadCount > 0 && (
                    <TouchableOpacity
                        style={[styles.markAllButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleMarkAllAsRead}
                    >
                        <Ionicons name="checkmark-done-outline" size={18} color="white" />
                        <Text style={styles.markAllText}>Mark all as read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item._id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <Ionicons name="notifications-off-outline" size={48} color={theme.colors.outline} />
                        </View>
                        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>No notifications found</Text>
                        <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>We'll notify you when something important happens.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    controls: {
        padding: 16,
        paddingBottom: 8,
    },
    segmentedButtons: {
        marginBottom: 12,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    markAllText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '700',
        fontSize: 14,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    card: {
        marginBottom: 12,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    titleColumn: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        color: '#222222', // Fallback - dynamic theming applied in component
        fontWeight: '500',
        flex: 1,
    },
    unreadTitle: {
        fontWeight: 'bold',
        color: '#000',
    },
    time: {
        fontSize: 11,
        color: '#95a5a6',
        marginLeft: 8,
    },
    body: {
        fontSize: 13,
        color: '#576574',
        lineHeight: 18,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#95a5a6',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default NotificationInboxScreen;
