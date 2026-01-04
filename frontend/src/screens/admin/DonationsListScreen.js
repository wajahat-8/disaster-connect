import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, SegmentedButtons, useTheme, Card, Avatar } from 'react-native-paper';
import { getAllDonations, getDonationSummary } from '../../api/donationApi';
import AppLoader from '../../components/common/AppLoader';
import { useAuth } from '../../auth';

const DonationsListScreen = () => {
    const { isAdmin } = useAuth();
    const theme = useTheme();
    const [donations, setDonations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'money', 'supplies'

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [donationsRes, summaryRes] = await Promise.all([
                getAllDonations(),
                getDonationSummary()
            ]);

            if (donationsRes.success) {
                setDonations(donationsRes.data);
            }
            if (summaryRes.success) {
                setSummary(summaryRes.data);
            }
        } catch (error) {
            console.error('Error loading donations:', error);
            Alert.alert('Error', 'Failed to load donation data');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredDonations = () => {
        if (filter === 'all') return donations;
        return donations.filter(d => d.type === filter);
    };

    const renderSummaryCard = () => (
        <Card style={styles.summaryCard}>
            <Card.Content>
                <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: 'bold' }}>Overview</Text>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            ${summary?.totalMoney?.toLocaleString() || '0'}
                        </Text>
                        <Text variant="bodySmall">Total Raised</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text variant="headlineSmall" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
                            {summary?.totalSupplies || 0}
                        </Text>
                        <Text variant="bodySmall">Supply Pledges</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text variant="headlineSmall" style={{ color: '#f39c12', fontWeight: 'bold' }}>
                            {summary?.totalDonations || 0}
                        </Text>
                        <Text variant="bodySmall">Total Donations</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Title
                title={item.type === 'money' ? `$${item.amount}` : 'Supplies Donation'}
                subtitle={`By: ${item.donorId?.name || 'Unknown'}`}
                left={(props) => (
                    <Avatar.Icon
                        {...props}
                        icon={item.type === 'money' ? 'cash' : 'package-variant'}
                        style={{ backgroundColor: item.type === 'money' ? theme.colors.primaryContainer : theme.colors.secondaryContainer }}
                        color={item.type === 'money' ? theme.colors.primary : theme.colors.secondary}
                    />
                )}
                right={(props) => (
                    <Text variant="bodySmall" style={{ marginRight: 16, color: theme.colors.outline }}>
                        {new Date(item.date).toLocaleDateString()}
                    </Text>
                )}
            />
            <Card.Content>
                {item.type === 'supplies' && (
                    <Text variant="bodyMedium" style={{ marginTop: -10, marginBottom: 8 }}>{item.itemDescription}</Text>
                )}
                {item.location && item.location.address && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Avatar.Icon size={24} icon="map-marker" style={{ backgroundColor: 'transparent' }} color={theme.colors.secondary} />
                        <Text variant="bodySmall" style={{ marginLeft: 4, flex: 1, color: 'gray' }}>
                            {item.location.address}
                        </Text>
                    </View>
                )}
            </Card.Content>
        </Card>
    );

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {loading ? (
                <AppLoader visible={true} />
            ) : (
                <FlatList
                    data={getFilteredDonations()}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    ListHeaderComponent={
                        <>
                            {renderSummaryCard()}
                            <SegmentedButtons
                                value={filter}
                                onValueChange={setFilter}
                                buttons={[
                                    { value: 'all', label: 'All' },
                                    { value: 'money', label: 'Money' },
                                    { value: 'supplies', label: 'Supplies' },
                                ]}
                                style={styles.filter}
                            />
                        </>
                    }
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No donations found</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    summaryCard: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        alignItems: 'center',
    },
    filter: {
        marginBottom: 16,
    },
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        opacity: 0.6,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: 'red',
    },
});

export default DonationsListScreen;
