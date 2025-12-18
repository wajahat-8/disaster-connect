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

            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
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
                    color={locationCaptured ? "green" : "gray"}
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
        backgroundColor: 'white',
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
        color: 'gray',
    },
    noLocationText: {
        color: 'gray',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    button: {
        flex: 1,
    },
});

export default LocationCapture;
