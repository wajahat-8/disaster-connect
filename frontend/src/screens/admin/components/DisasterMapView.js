import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const DisasterMapView = ({ disasters, onMarkerPress, onDelete }) => {
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeMap();
    }, []);

    const initializeMap = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to show the map.');
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
        } catch (error) {
            console.error('Error initializing map:', error);
            // Fallback to default location
            setRegion({
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
        } finally {
            setLoading(false);
        }
    };

    const getMarkerColor = (severity) => {
        switch (severity) {
            case 'critical':
                return '#e74c3c';
            case 'high':
                return '#e67e22';
            case 'medium':
                return '#f39c12';
            case 'low':
                return '#27ae60';
            default:
                return '#3498db';
        }
    };

    if (loading || !region) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <MapView style={styles.map} initialRegion={region} showsUserLocation>
            {disasters.map((disaster, index) => (
                <Marker
                    key={disaster._id || index}
                    coordinate={{
                        latitude: disaster.location.coordinates[1],
                        longitude: disaster.location.coordinates[0],
                    }}
                    pinColor={getMarkerColor(disaster.severity)}
                    onPress={() => onMarkerPress && onMarkerPress(disaster)}
                    title={disaster.type.toUpperCase()}
                    description={disaster.description}
                />
            ))}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        minHeight: 400,
    },
    loadingContainer: {
        flex: 1,
        minHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DisasterMapView;
