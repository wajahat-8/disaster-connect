import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, Animated } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text, Card, Button, Searchbar, useTheme, FAB, Chip, Surface, IconButton } from 'react-native-paper';
import { getShelters } from '../../api/shelterApi';
import { useAuth } from '../../context/AuthContext';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ShelterListScreen({ navigation }) {
    const theme = useTheme();
    const { user } = useAuth();
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // 'map', 'list', 'both'

    useEffect(() => {
        loadShelters();
        getUserLocation();
    }, []);

    const loadShelters = async () => {
        try {
            setLoading(true);
            const data = await getShelters();
            if (data.success) {
                setShelters(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    };

    const filteredShelters = shelters.filter(shelter =>
        shelter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCapacityColor = (available, total) => {
        const ratio = available / total;
        if (ratio < 0.2) return theme.colors.error;
        if (ratio < 0.5) return theme.colors.warning;
        return theme.colors.success; // Default theme success or green
    };

    const renderShelterItem = ({ item }) => (
        <Card style={styles.card} mode="elevated" onPress={() => navigation.navigate('ShelterDetail', { shelter: item })}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={styles.shelterName}>{item.name}</Text>
                    {item.verified && (
                        <MaterialCommunityIcons name="check-decagram" size={20} color={theme.colors.primary} />
                    )}
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoBadge}>
                        <MaterialCommunityIcons name="bed" size={16} color="#666" />
                        <Text variant="bodyMedium" style={{ marginLeft: 4, fontWeight: 'bold', color: getCapacityColor(item.availableBeds, item.capacity) }}>
                            {item.availableBeds} / {item.capacity} Beds
                        </Text>
                    </View>
                </View>

                {item.facilities.length > 0 && (
                    <View style={styles.facilitiesRow}>
                        {item.facilities.slice(0, 3).map((fac, idx) => (
                            <Chip key={idx} style={styles.miniChip} textStyle={{ fontSize: 10, lineHeight: 10 }} height={24}>{fac}</Chip>
                        ))}
                        {item.facilities.length > 3 && (
                            <Text variant="bodySmall" style={{ alignSelf: 'center', color: 'gray' }}>+{item.facilities.length - 3}</Text>
                        )}
                    </View>
                )}
            </Card.Content>
            <Card.Actions style={{ paddingTop: 0 }}>
                <Button mode="text" onPress={() => navigation.navigate('ShelterDetail', { shelter: item })}>View Details</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Searchbar
                    placeholder="Search Shelters..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                    elevation={1}
                />
            </View>

            {/* Map View */}
            <View style={[styles.mapContainer, viewMode === 'list' && { height: 0 }]}>
                <MapView
                    style={styles.map}
                    region={userLocation}
                    showsUserLocation={true}
                    showsCompass={true}
                    showsScale={true}
                >
                    {filteredShelters.map((shelter) => (
                        <Marker
                            key={shelter._id}
                            coordinate={{
                                latitude: shelter.location.coordinates[1],
                                longitude: shelter.location.coordinates[0],
                            }}
                        >
                            <Callout onPress={() => navigation.navigate('ShelterDetail', { shelter })}>
                                <View style={styles.callout}>
                                    <Text style={styles.calloutTitle}>{shelter.name}</Text>
                                    <Text>{shelter.availableBeds} beds available</Text>
                                    <Text style={{ color: 'blue' }}>Tap for details</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                {/* View Toggles Overlaid on Map */}
                <View style={styles.viewToggleContainer}>
                    <Surface style={styles.toggleSurface} elevation={2}>
                        <IconButton
                            icon={viewMode === 'map' ? "format-list-bulleted" : "map"}
                            size={20}
                            onPress={() => setViewMode(viewMode === 'map' ? 'both' : 'map')}
                        />
                    </Surface>
                </View>
            </View>

            {/* List View */}
            {viewMode !== 'map' && (
                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <Text variant="titleSmall" style={{ color: 'gray' }}>{filteredShelters.length} Shelters found</Text>
                        <Button mode="text" compressed onPress={() => setViewMode(viewMode === 'both' ? 'list' : 'both')}>
                            {viewMode === 'both' ? 'Expand List' : 'Show Map'}
                        </Button>
                    </View>
                    <FlatList
                        data={filteredShelters}
                        renderItem={renderShelterItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {user?.role === 'admin' && (
                <FAB
                    icon="plus"
                    label="Add Shelter"
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    color="white"
                    onPress={() => navigation.navigate('AddShelter')}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        padding: 10,
        backgroundColor: 'white',
        zIndex: 1,
    },
    searchbar: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        height: 46,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    viewToggleContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    toggleSurface: {
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        flex: 1.2, // Give list slightly more space in 'both' mode
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -15, // Overlap map slightly
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: 'white',
    },
    listContent: {
        padding: 10,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    shelterName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    facilitiesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    miniChip: {
        backgroundColor: '#e6f0ff',
        height: 26,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    callout: {
        width: 150,
        padding: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
