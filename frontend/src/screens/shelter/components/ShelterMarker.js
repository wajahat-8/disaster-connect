import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getShelterColor = (available, capacity) => {
    if (available === 0) return '#F44336'; // Red - Full
    const percentage = available / capacity;
    if (percentage < 0.2) return '#FF9800'; // Orange - Low availability
    return '#4CAF50'; // Green - Available
};

const ShelterMarker = ({ shelter, onPress }) => {
    const theme = useTheme();
    // Optimization to prevent rendering flicker on Android
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const markerColor = getShelterColor(shelter.availableBeds, shelter.capacity);

    return (
        <Marker
            coordinate={{
                latitude: shelter.location.coordinates[1],
                longitude: shelter.location.coordinates[0],
            }}
            onPress={() => onPress(shelter)}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={tracksViewChanges}
            zIndex={100}
        >
            <View style={[styles.circle, { backgroundColor: markerColor }]}>
                <MaterialCommunityIcons
                    name="home-city"
                    size={22}
                    color="white"
                />
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
});

export default ShelterMarker;
