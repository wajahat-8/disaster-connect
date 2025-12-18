import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import MapView, { Marker, Callout } from 'react-native-maps';
import ShelterMarker from './ShelterMarker';

/**
 * Map view component for displaying shelter locations.
 * @param {Object} props
 * @param {Object} props.region - Map region { latitude, longitude, latitudeDelta, longitudeDelta }
 * @param {Array} props.shelters - Array of shelter objects
 * @param {string} props.viewMode - Current view mode ('list', 'map', 'both')
 * @param {Function} props.onViewModeToggle - Callback to toggle view mode
 * @param {Function} props.onShelterPress - Callback when shelter is selected
 */
const ShelterMapView = ({ region, shelters, viewMode, onViewModeToggle, onShelterPress }) => {
    if (viewMode === 'list') {
        return null;
    }

    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsCompass={true}
                showsScale={true}
            >
                {shelters.map((shelter) => (
                    <ShelterMarker
                        key={shelter._id}
                        shelter={shelter}
                        onPress={onShelterPress}
                    />
                ))}
            </MapView>

            {/* View mode toggle button */}
            <View style={styles.viewToggleContainer}>
                <Surface style={styles.toggleSurface} elevation={2}>
                    <IconButton
                        icon={viewMode === 'map' ? "format-list-bulleted" : "map"}
                        size={20}
                        onPress={onViewModeToggle}
                    />
                </Surface>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    callout: {
        width: 150,
        padding: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutAction: {
        color: 'blue',
    },
});

export default ShelterMapView;
