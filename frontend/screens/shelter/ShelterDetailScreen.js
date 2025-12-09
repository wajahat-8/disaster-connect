import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Linking, Platform, Dimensions } from 'react-native';
import { Text, Button, Card, Chip, Divider, useTheme, Surface, Avatar } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ShelterDetailScreen({ route, navigation }) {
    const { shelter } = route.params;
    const theme = useTheme();

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

    // Helper to get icon for facility
    const getFacilityIcon = (facility) => {
        const fac = facility.toLowerCase();
        if (fac.includes('medical') || fac.includes('doctor')) return 'doctor';
        if (fac.includes('food') || fac.includes('kitchen')) return 'food';
        if (fac.includes('water')) return 'water';
        if (fac.includes('bed') || fac.includes('sleep')) return 'bed';
        if (fac.includes('wifi') || fac.includes('internet')) return 'wifi';
        if (fac.includes('power') || fac.includes('charge')) return 'power-plug';
        if (fac.includes('shower') || fac.includes('bath')) return 'shower';
        if (fac.includes('kid') || fac.includes('child')) return 'baby-carriage';
        return 'check-circle-outline';
    };

    const occupancyColor = useMemo(() => {
        const ratio = shelter.availableBeds / shelter.capacity;
        if (ratio < 0.2) return theme.colors.error;
        if (ratio < 0.5) return theme.colors.warning;
        return theme.colors.success;
    }, [shelter]);

    return (
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
                <Surface style={styles.mapOverlay} elevation={2} />
            </View>

            <View style={styles.contentContainer}>
                {/* Header Info */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text variant="headlineMedium" style={styles.title}>{shelter.name}</Text>
                        <View style={styles.verifiedContainer}>
                            {shelter.verified ? (
                                <Chip icon="check-decagram" style={styles.verifiedChip} textStyle={{ color: 'green' }}>Verified Shelter</Chip>
                            ) : (
                                <Chip icon="alert-circle-outline" style={styles.unverifiedChip} textStyle={{ color: 'orange' }}>Unverified</Chip>
                            )}
                        </View>
                    </View>
                </View>

                {/* Status Cards */}
                <View style={styles.statusGrid}>
                    <Surface style={[styles.statusCard, { borderLeftColor: occupancyColor, borderLeftWidth: 4 }]} elevation={1}>
                        <MaterialCommunityIcons name="bed-empty" size={24} color={occupancyColor} />
                        <View style={{ marginLeft: 10 }}>
                            <Text variant="labelMedium" style={{ color: 'gray' }}>Availability</Text>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{shelter.availableBeds} / {shelter.capacity}</Text>
                        </View>
                    </Surface>
                </View>

                <Divider style={styles.divider} />

                {/* Facilities */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="domain" size={20} color={theme.colors.primary} />
                        <Text variant="titleMedium" style={styles.sectionTitle}>Facilities & Services</Text>
                    </View>
                    <View style={styles.facilitiesContainer}>
                        {shelter.facilities.length > 0 ? (
                            shelter.facilities.map((fac, index) => (
                                <Chip
                                    key={index}
                                    style={styles.facilityChip}
                                    icon={getFacilityIcon(fac)}
                                    mode="flat"
                                >
                                    {fac}
                                </Chip>
                            ))
                        ) : (
                            <Text style={{ color: 'gray', fontStyle: 'italic' }}>No specific facilities information available.</Text>
                        )}
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* Contact & Location */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color={theme.colors.primary} />
                        <Text variant="titleMedium" style={styles.sectionTitle}>Contact & Location</Text>
                    </View>

                    {shelter.contactInfo?.phone && (
                        <View style={styles.contactRow}>
                            <Avatar.Icon size={36} icon="phone" style={{ backgroundColor: '#e0f2f1' }} color={theme.colors.primary} />
                            <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                                <Text variant="bodySmall" style={{ color: 'gray' }}>Phone</Text>
                                <Text variant="bodyLarge" onPress={() => Linking.openURL(`tel:${shelter.contactInfo.phone}`)} style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                    {shelter.contactInfo.phone}
                                </Text>
                            </View>
                        </View>
                    )}

                    {shelter.contactInfo?.email && (
                        <View style={styles.contactRow}>
                            <Avatar.Icon size={36} icon="email" style={{ backgroundColor: '#e3f2fd' }} color="#1976d2" />
                            <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                                <Text variant="bodySmall" style={{ color: 'gray' }}>Email</Text>
                                <Text variant="bodyLarge">{shelter.contactInfo.email}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <Button
                    mode="contained"
                    icon="navigation"
                    onPress={openMaps}
                    style={styles.navButton}
                    contentStyle={{ height: 50 }}
                >
                    Get Directions
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        height: 250,
        width: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
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
        marginTop: 0,
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    verifiedContainer: {
        flexDirection: 'row',
    },
    verifiedChip: {
        backgroundColor: '#e8f5e9',
        height: 28,
    },
    unverifiedChip: {
        backgroundColor: '#fff3e0',
        height: 28,
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
    divider: {
        marginVertical: 20,
        backgroundColor: '#f0f0f0',
        height: 1,
    },
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    facilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    facilityChip: {
        backgroundColor: '#f5f5f5',
    },
    contactRow: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    navButton: {
        marginTop: 20,
        borderRadius: 12,
        elevation: 4,
    }
});
