import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Text
} from 'react-native';
import { Card, Chip, SegmentedButtons, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';

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
            await apiClient.patch(`/notifications/${notificationId}/read`);
            // Update local state
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId
                        ? { ...notif, isRead: true, readAt: new Date() }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
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

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            onPress={() => !item.isRead && handleMarkAsRead(item._id)}
            activeOpacity={0.7}
        >
            <Card
                style={[
                    styles.card,
                    !item.isRead && styles.unreadCard
                ]}
            >
                <View style={styles.cardContent}>
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            {!item.isRead && (
                                <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
                            )}
                            <Text
                                style={[
                                    styles.title,
                                    !item.isRead && styles.unreadTitle
                                ]}
                            >
                                {item.title}
                            </Text>
                        </View>
                        <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
                    </View>

                    <Text style={styles.body} numberOfLines={3}>
                        {item.body}
                    </Text>

                    <View style={styles.footer}>
                        <Chip
                            mode="outlined"
                            compact
                            style={styles.typeChip}
                            textStyle={{ fontSize: 11 }}
                        >
                            {item.type}
                        </Chip>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    if (loading) {
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
                        { value: 'unread', label: `Unread (${unreadCount})` },
                        { value: 'read', label: 'Read' }
                    ]}
                    style={styles.segmentedButtons}
                />

                {unreadCount > 0 && (
                    <TouchableOpacity
                        style={[styles.markAllButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleMarkAllAsRead}
                    >
                        <Ionicons name="checkmark-done" size={16} color="white" />
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item._id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No notifications</Text>
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
        padding: 15,
        paddingBottom: 10,
    },
    segmentedButtons: {
        marginBottom: 10,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
    },
    markAllText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: '600',
    },
    listContent: {
        padding: 15,
        paddingTop: 0,
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    cardContent: {
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        color: '#2c3e50',
        flex: 1,
    },
    unreadTitle: {
        fontWeight: 'bold',
    },
    time: {
        fontSize: 12,
        color: '#95a5a6',
        marginLeft: 10,
    },
    body: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    typeChip: {
        height: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: '#95a5a6',
    },
});

export default NotificationInboxScreen;
