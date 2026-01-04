import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Linking, Platform, Modal } from 'react-native';
import { Text, Chip, Divider, useTheme, Surface } from 'react-native-paper';
import AppButton from '../../components/common/AppButton';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FacilitiesList, ContactInfo } from './components';

/**
 * Screen showing detailed information about a shelter.
 * Includes map, capacity, facilities, and contact info.
 */
export default function ShelterDetailScreen({ route, navigation }) {
    const { shelter } = route.params || {};
    const theme = useTheme();

    // ============ Safety Check ============
    if (!shelter || !shelter.location || !shelter.location.coordinates) {
        return (
            <View style={[styles.container, styles.center]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color="gray" />
                <Text variant="titleMedium" style={{ marginTop: 10 }}>Shelter details not found</Text>
                <AppButton
                    mode="text"
                    text="Go Back"
                    onPress={() => navigation.goBack()}
                />
            </View>
        );
    }

    // ============ Helpers ============

    // ============ State ============
    const [mapVisible, setMapVisible] = React.useState(false);

    // ============ Helpers ============

    const openMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${shelter.location.coordinates[1]},${shelter.location.coordinates[0]}`;
        const label = shelter.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url);
    };

    const occupancyColor = useMemo(() => {
        const available = shelter.availableBeds || 0;
        const capacity = shelter.capacity || 1;
        const ratio = available / capacity;
        if (ratio < 0.2) return theme.colors.error;
        if (ratio < 0.5) return theme.colors.warning;
        return theme.colors.success;
    }, [shelter, theme]);

    // ============ Render ============

    return (
        <>
            <ScrollView style={styles.container} bounces={false}>
                {/* Map Header */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: shelter.location.coordinates[1],
                            longitude: shelter.location.coordinates[0],
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                    >
                        <Marker
                            coordinate={{
                                latitude: shelter.location.coordinates[1],
                                longitude: shelter.location.coordinates[0],
                            }}
                        />
                    </MapView>
                    {/* Expand Map Button */}
                    <Surface style={styles.expandButtonContainer} elevation={4}>
                        <MaterialCommunityIcons
                            name="arrow-expand-all"
                            size={24}
                            color={theme.colors.primary}
                            onPress={() => setMapVisible(true)}
                        />
                    </Surface>
                    <Surface style={styles.mapOverlay} elevation={2} />
                </View>

                <View style={styles.contentContainer}>
                    {/* Header with name and verified status */}
                    <View style={styles.header}>
                        <Text variant="headlineMedium" style={styles.title} numberOfLines={3}>
                            {shelter.name}
                        </Text>
                        <View style={styles.verifiedContainer}>
                            {shelter.verified ? (
                                <Chip
                                    icon="check-decagram"
                                    style={styles.verifiedChip}
                                    textStyle={{
                                        color: 'green',
                                        fontSize: 12,
                                        lineHeight: 14,
                                        marginVertical: 0
                                    }}
                                >
                                    Verified Shelter
                                </Chip>
                            ) : (
                                <Chip
                                    icon="alert-circle-outline"
                                    style={styles.unverifiedChip}
                                    textStyle={{
                                        color: 'orange',
                                        fontSize: 12,
                                        lineHeight: 14,
                                        marginVertical: 0
                                    }}
                                >
                                    Unverified
                                </Chip>
                            )}
                        </View>
                    </View>

                    {/* Availability Status Card */}
                    <View style={styles.statusGrid}>
                        <Surface style={[styles.statusCard, { borderLeftColor: occupancyColor, borderLeftWidth: 4 }]} elevation={1}>
                            <MaterialCommunityIcons name="bed-empty" size={24} color={occupancyColor} />
                            <View style={styles.statusText}>
                                <Text variant="labelMedium" style={{ color: 'gray' }}>Availability</Text>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                                    {shelter.availableBeds || 0} / {shelter.capacity || 0}
                                </Text>
                            </View>
                        </Surface>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Facilities Section */}
                    <FacilitiesList facilities={shelter.facilities || []} />

                    <Divider style={styles.divider} />

                    {/* Contact Section */}
                    <ContactInfo contactInfo={shelter.contactInfo || {}} />

                    {/* Get Directions Button */}
                    <AppButton
                        mode="contained"
                        icon="navigation"
                        text="Get Directions"
                        onPress={openMaps}
                        style={styles.navButton}
                        contentStyle={{ height: 50 }}
                    />
                    {/* View on Map Button (Secondary) */}
                    <AppButton
                        mode="outlined"
                        icon="map"
                        text="View Full Map"
                        onPress={() => setMapVisible(true)}
                        style={styles.viewMapButton}
                    />
                </View>
            </ScrollView>

            {/* Full Screen Map Modal */}
            <Modal
                animationType="slide"
                visible={mapVisible}
                onRequestClose={() => setMapVisible(false)}
            >
                <View style={styles.fullScreenMapContainer}>
                    <MapView
                        style={styles.fullScreenMap}
                        initialRegion={{
                            latitude: shelter.location.coordinates[1],
                            longitude: shelter.location.coordinates[0],
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation={true}
                    >
                        <Marker
                            coordinate={{
                                latitude: shelter.location.coordinates[1],
                                longitude: shelter.location.coordinates[0],
                            }}
                            title={shelter.name}
                            description="Shelter Location"
                        />
                    </MapView>
                    <Surface style={styles.closeMapButton} elevation={4}>
                        <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color="black"
                            onPress={() => setMapVisible(false)}
                        />
                    </Surface>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mapContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    expandButtonContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: -20,
        height: 40,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
        marginTop: 30, // Increased from 10
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
        lineHeight: 32,
    },
    verifiedContainer: {
        flexDirection: 'row',
    },
    verifiedChip: {
        backgroundColor: '#e8f5e9',
        height: 36, // Further increased
        justifyContent: 'center',
        alignItems: 'center',
    },
    unverifiedChip: {
        backgroundColor: '#fff3e0',
        height: 36, // Further increased
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusGrid: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statusCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 10,
    },
    divider: {
        marginVertical: 20,
        backgroundColor: '#f0f0f0',
        height: 1,
    },
    navButton: {
        marginTop: 20,
        borderRadius: 12,
    },
    viewMapButton: {
        marginTop: 10,
        borderRadius: 12,
        borderColor: '#ddd'
    },
    fullScreenMapContainer: {
        flex: 1,
        position: 'relative'
    },
    fullScreenMap: {
        flex: 1,
    },
    closeMapButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
