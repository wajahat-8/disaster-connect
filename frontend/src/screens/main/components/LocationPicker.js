import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import * as Location from 'expo-location';
import AppCard from '../../../components/common/AppCard';
import AppButton from '../../../components/common/AppButton';

/**
 * Location picker component with GPS button and address display.
 * @param {Object} props
 * @param {Object|null} props.coordinates - { latitude, longitude } or null
 * @param {string} props.address - Human-readable address
 * @param {boolean} props.loading - Whether location is being fetched
 * @param {Function} props.onLocationChange - Callback when location changes ({ coordinates, address })
 */
const LocationPicker = ({ coordinates, address, loading, onLocationChange }) => {
    const theme = useTheme();

    const getCurrentLocation = async () => {
        try {
            // Optimization: Try last known position first
            let location = await Location.getLastKnownPositionAsync({});

            if (!location) {
                location = await Location.getCurrentPositionAsync({});
            }
            const { latitude, longitude } = location.coords;

            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            const addressStr = geocode[0]
                ? `${geocode[0].street || ''} ${geocode[0].city || ''} ${geocode[0].region || ''}`.trim()
                : '';

            onLocationChange({
                coordinates: { latitude, longitude },
                address: addressStr
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to get location. Please try again.');
        }
    };

    return (
        <AppCard>
            <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>
                Location
            </Text>
            <AppButton
                mode="outlined"
                text={coordinates ? 'Update Location' : 'Get Current Location'}
                onPress={getCurrentLocation}
                loading={loading}
                disabled={loading}
                icon="crosshairs-gps"
            />
            {address ? (
                <View style={styles.addressBox}>
                    <IconButton icon="map-marker" size={20} />
                    <Text variant="bodySmall" style={styles.addressText}>{address}</Text>
                </View>
            ) : null}
        </AppCard>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginTop: 10,
        paddingRight: 10
    },
    addressText: {
        flex: 1,
        fontStyle: 'italic',
    },
});

export default LocationPicker;
