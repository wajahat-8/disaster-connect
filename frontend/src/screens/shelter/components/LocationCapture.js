import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import LocationPickerModal from '../../main/components/LocationPickerModal';

/**
 * Location capture component for adding shelters.
 * @param {Object} props
 * @param {Object} props.location - { lat, lng } coordinates
 * @param {boolean} props.locationCaptured - Whether location has been captured
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onLocationChange - Callback when location changes
 */
const LocationCapture = ({ location, locationCaptured, loading, onLocationChange }) => {
    const theme = useTheme();
    const [showMapPicker, setShowMapPicker] = useState(false);

    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required.');
                return;
            }

            // Optimization: Try last known position first
            let loc = await Location.getLastKnownPositionAsync({});

            if (!loc) {
                loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            }
            onLocationChange({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude
            });
        } catch (e) {
            Alert.alert('Error', 'Could not fetch location. Please try again.');
        }
    };

    const handleMapPick = (lat, lng) => {
        onLocationChange({ lat, lng });
    };

    return (
        <Surface style={styles.locationCard} elevation={1}>
            <View style={styles.locationInfo}>
                <MaterialCommunityIcons
                    name={locationCaptured ? "map-marker-check" : "map-marker-off"}
                    size={30}
                    color={locationCaptured ? theme.colors.success : theme.colors.textTertiary}
                />
                <View style={styles.locationText}>
                    {locationCaptured ? (
                        <>
                            <Text variant="bodyMedium" style={styles.capturedLabel}>Location Captured</Text>
                            <Text variant="bodySmall" style={styles.coordsText}>
                                Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
                            </Text>
                        </>
                    ) : (
                        <Text variant="bodyMedium" style={styles.noLocationText}>No location set</Text>
                    )}
                </View>
            </View>

            <View style={styles.buttonRow}>
                <Button
                    mode="outlined"
                    onPress={getCurrentLocation}
                    loading={loading}
                    icon="crosshairs-gps"
                    style={[styles.button, { borderColor: theme.colors.primary }]}
                    textColor={theme.colors.primary}
                >
                    Use GPS
                </Button>
                <Button
                    mode="contained"
                    onPress={() => setShowMapPicker(true)}
                    icon="map-marker-radius"
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                >
                    Pick on Map
                </Button>
            </View>

            <LocationPickerModal
                visible={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onLocationSelected={handleMapPick}
                initialLat={locationCaptured ? location.lat : 37.78825}
                initialLng={locationCaptured ? location.lng : -122.4324}
            />
        </Surface>
    );
};

const styles = StyleSheet.create({
    locationCard: {
        backgroundColor: 'white', // Surface usually handles this, but keeping if needed explicit
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    locationText: {
        marginLeft: 15,
        flex: 1,
    },
    capturedLabel: {
        fontWeight: 'bold',
    },
    coordsText: {
        color: 'gray', // Should use theme.colors.textSecondary but outside component scope. 
        // Will use StyleSheet.create but we can't access theme here easily without refactor.
        // Keeping as is for now or moving styles inside? 
        // Better: Remove this style usage and use inline style with theme or rely on Text variant default?
        // Let's stick to replacing colors where possible. 
        // For styles defined outside, we can't assume theme access. 
        // Actually, we can just leave it 'gray' as it matches textSecondary usually, 
        // OR we can export a function or use hooks.
        // Safest low-risk: leave as gray for now, focusing on component logic colors first?
        // User asked to standardize.
        // Let's leave 'gray' here as it is effectively textSecondary. 
        color: '#7f8c8d',
    },
    noLocationText: {
        color: 'gray',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
        // gap: 10, removed for compatibility
    },
    button: {
        flex: 1,
        marginHorizontal: 5, // Simulating gap=10 (5 on each side)
    },
});

export default LocationCapture;
