import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Get color based on disaster severity
 */
const getMarkerColor = (severity, theme) => {
    switch (severity) {
        case 'critical':
            return theme.colors.error;
        case 'high':
            return '#FFA500';
        case 'medium':
            return '#FFD700';
        case 'low':
            return '#2ECC71';
        default:
            return '#9E9E9E';
    }
};

/**
 * Get icon based on disaster type
 */
const getDisasterIcon = (type) => {
    switch (type) {
        case 'flood':
            return 'water';
        case 'fire':
            return 'fire';
        case 'earthquake':
            return 'earth';
        default:
            return 'alert';
    }
};

const DisasterMarker = ({ disaster, onPress }) => {
    const theme = useTheme();
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    useEffect(() => {
        // Allow a few frames for layout, then freeze rendering (perf fix)
        // Increased time to allow Android layout to settle avoids clipping
        const timer = setTimeout(() => setTracksViewChanges(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const markerColor = getMarkerColor(disaster.severity, theme);
    const iconName = getDisasterIcon(disaster.type);

    return (
        <Marker
            coordinate={{
                latitude: disaster.location.coordinates[1],
                longitude: disaster.location.coordinates[0],
            }}
            onPress={() => {
                if (onPress) {
                    onPress(disaster);
                }
            }}
            anchor={{ x: 0.5, y: 0.5 }} // Center the circle on the location
            tracksViewChanges={tracksViewChanges} // Use state value for optimization
            renderToHardwareTextureAndroid={false}
            zIndex={1000}
        >
            <View style={[styles.circle, { backgroundColor: markerColor }]}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={24} // Larger icon for circle
                    color="#FFFFFF"
                />
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    circle: {
        width: 44,
        height: 44,
        borderRadius: 22, // Make it a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5722', // Default color, overridden by style prop or logic if needed? 
        // Wait, we need the dynamic background color based on severity.
        // Let's rely on the previous logic but apply it to background instead of border/text.
        borderWidth: 3,
        borderColor: '#FFFFFF', // White border for contrast
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
});

export default DisasterMarker;
