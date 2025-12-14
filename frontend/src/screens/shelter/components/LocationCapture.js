import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

/**
 * Location capture component for adding shelters.
 * @param {Object} props
 * @param {Object} props.location - { lat, lng } coordinates
 * @param {boolean} props.locationCaptured - Whether location has been captured
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onLocationChange - Callback when location changes
 */
const LocationCapture = ({ location, locationCaptured, loading, onLocationChange }) => {
    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to tag the shelter.');
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
            <Button
                mode={locationCaptured ? "outlined" : "contained"}
                onPress={getCurrentLocation}
                loading={loading}
                icon="crosshairs-gps"
                style={styles.captureButton}
            >
                {locationCaptured ? "Update Location" : "Capture Location"}
            </Button>
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
    captureButton: {
        marginTop: 10,
    },
});

export default LocationCapture;
