import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Searchbar, useTheme, Button, FAB, IconButton } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useShelters } from '../../hooks/useShelters';
import { useAuth } from '../../auth';
import * as Location from 'expo-location';
import { ShelterCard, ShelterMapView } from './components';
import { formatDistance } from '../../utils/locationUtils';
import AppLoader from '../../components/common/AppLoader';
import LocationPermissionPrompt from '../../components/common/LocationPermissionPrompt';

/**
 * Screen for listing and finding nearby shelters.
 * Supports list view, map view, and combined view modes.
 */
export default function ShelterListScreen() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { user } = useAuth();
    const { shelters, loading, error, fetchShelters } = useShelters();

    // Default to a central location (e.g. city center) if location not yet found
    const [location, setLocation] = useState({
        latitude: 31.5204,
        longitude: 74.3587,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'map', or 'both'
    const [nearestShelter, setNearestShelter] = useState(null);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

    // ============ Initialization ============



    // ============ Initialization ============

    // Fetch data when screen comes into focus (e.g. after adding a shelter)
    useFocusEffect(
        React.useCallback(() => {
            initializeLocation();
        }, [])
    );

    // Initial location setup (runs once on mount)
    useEffect(() => {
        initializeLocation();
    }, []);

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
        }
    }, [error]);

    const initializeLocation = async () => {
        try {
            // Check permission first
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationPermissionDenied(true);
                return;
            }

            setLocationPermissionDenied(false);

            // Optimization: Try to get last known position first (instant)
            let loc = await Location.getLastKnownPositionAsync({});

            // If no last known location, wait for current position (slower but accurate)
            if (!loc) {
                loc = await Location.getCurrentPositionAsync({});
            }

            if (loc) {
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });

                // Radius increased to 10000km to ensure admin added shelters (likely far away) are shown during testing
                fetchShelters({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                    radius: 50
                });
            }
        } catch (error) {
            console.error('Error initializing location:', error);
            setLocationPermissionDenied(true);
        }
    };

    // Update nearest shelter when shelters change
    useEffect(() => {
        if (shelters.length > 0 && location) {
            // Shelters are already sorted by distance from backend
            // Just pick the first one
            const nearest = shelters[0];
            if (nearest.distance !== undefined) {
                setNearestShelter(nearest);
            }
        }
    }, [shelters, location]);

    // ============ Handlers ============

    const handleSearch = () => {
        fetchShelters({
            search: searchQuery,
            lat: location?.latitude,
            lng: location?.longitude,
            radius: 50
        });
    };

    const onRefresh = () => {
        fetchShelters({
            search: searchQuery,
            lat: location?.latitude,
            lng: location?.longitude,
            radius: 50
        });
    };

    const handleShelterPress = (shelter) => {
        navigation.navigate('ShelterDetail', { shelter });
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'map' ? 'both' : 'map');
    };

    const toggleListExpand = () => {
        setViewMode(viewMode === 'both' ? 'list' : 'both');
    };

    const handleFindNearest = () => {
        if (!location) {
            Alert.alert('Location Required', 'Please enable location services to find the nearest shelter.');
            return;
        }

        if (!nearestShelter) {
            Alert.alert('No Shelters Found', 'No shelters available in your area.');
            return;
        }

        Alert.alert(
            'Nearest Shelter',
            `${nearestShelter.name} is the closest shelter, ${formatDistance(nearestShelter.distance)} away.`,
            [
                { text: 'View Details', onPress: () => handleShelterPress(nearestShelter) },
                { text: 'OK', style: 'cancel' }
            ]
        );
    };

    // ============ Render ============

    // Show location permission prompt if denied
    if (locationPermissionDenied) {
        return <LocationPermissionPrompt />;
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.headerContainer}>
                <Searchbar
                    placeholder="Search Shelters..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                    elevation={1}
                    onSubmitEditing={handleSearch}
                />

                {/* Find Nearest Shelter Button */}
                {location && nearestShelter && (
                    <Button
                        mode="contained"
                        icon="navigation"
                        onPress={handleFindNearest}
                        style={styles.findNearestButton}
                        contentStyle={styles.findNearestContent}
                    >
                        Nearest: {formatDistance(nearestShelter.distance)}
                    </Button>
                )}
            </View>

            {/* Loading Overlay */}
            <AppLoader visible={loading} overlay message="Loading shelters..." />

            {/* Map View */}
            <ShelterMapView
                region={location}
                shelters={shelters}
                viewMode={viewMode}
                onViewModeToggle={toggleViewMode}
                onShelterPress={handleShelterPress}
            />

            {/* List View */}
            {
                viewMode !== 'map' && (
                    <View style={styles.listContainer}>
                        <View style={styles.listHeader}>
                            <Text variant="titleSmall" style={{ color: 'gray' }}>
                                {shelters.length} Shelters found
                            </Text>
                            <Button mode="text" compact onPress={toggleListExpand}>
                                {viewMode === 'both' ? 'Expand List' : 'Show Map'}
                            </Button>
                        </View>
                        <FlatList
                            data={shelters}
                            renderItem={({ item }) => (
                                <ShelterCard
                                    shelter={item}
                                    onPress={() => handleShelterPress(item)}
                                    userLocation={location}
                                    isNearest={nearestShelter?._id === item._id}
                                />
                            )}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )
            }

            {/* Admin FAB */}
            {
                user?.role === 'admin' && (
                    <FAB
                        icon="plus"
                        label="Add Shelter"
                        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                        color="white"
                        onPress={() => navigation.navigate('AddShelter')}
                    />
                )
            }
        </View >
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
    listContainer: {
        flex: 1.2,
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -15,
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
        paddingBottom: 80,
    },
    findNearestButton: {
        marginTop: 10,
        borderRadius: 10,
    },
    findNearestContent: {
        height: 44,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
