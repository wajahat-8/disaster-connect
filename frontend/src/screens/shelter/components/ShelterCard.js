import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppCard from '../../../components/common/AppCard';
import AppButton from '../../../components/common/AppButton';
import { formatDistance, getDistanceColor } from '../../../utils/locationUtils';

/**
 * Get capacity color based on availability ratio.
 */
const getCapacityColor = (available = 0, total = 1, theme) => {
    const ratio = available / (total || 1);
    if (ratio < 0.2) return theme.colors.error;
    if (ratio < 0.5) return theme.colors.warning;
    return theme.colors.success;
};

/**
 * Card component for displaying a shelter in a list.
 * @param {Object} props
 * @param {Object} props.shelter - Shelter data object
 * @param {Function} props.onPress - Callback when card is pressed
 * @param {Object} props.userLocation - User's current location (optional)
 * @param {boolean} props.isNearest - Whether this is the nearest shelter (optional)
 */
const ShelterCard = ({ shelter, onPress, userLocation, isNearest = false }) => {
    const theme = useTheme();

    return (
        <AppCard
            onPress={onPress}
            style={[
                styles.card,
                isNearest && styles.nearestCard
            ]}
        >
            {/* Nearest Badge - positioned at top, not overlapping */}
            {isNearest && (
                <View style={styles.nearestBadgeContainer}>
                    <View style={styles.nearestBadge}>
                        <MaterialCommunityIcons name="navigation" size={12} color="white" />
                        <Text variant="labelSmall" style={styles.nearestText}>NEAREST SHELTER</Text>
                    </View>
                </View>
            )}

            {/* Header with name and verified badge */}
            <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                    <Text variant="titleMedium" style={styles.shelterName} numberOfLines={2}>
                        {shelter.name}
                    </Text>
                    {shelter.verified && (
                        <MaterialCommunityIcons name="check-decagram" size={20} color={theme.colors.primary} style={{ marginLeft: 6 }} />
                    )}
                </View>
            </View>

            {/* Bed availability */}
            <View style={styles.infoRow}>
                <View style={[styles.infoBadge, { backgroundColor: theme.colors.lightBackground || '#f0f0f0' }]}>
                    <MaterialCommunityIcons name="bed" size={16} color="#666" />
                    <Text
                        variant="bodyMedium"
                        style={[styles.bedText, { color: getCapacityColor(shelter.availableBeds, shelter.capacity, theme) }]}
                    >
                        {shelter.availableBeds} / {shelter.capacity} Beds
                    </Text>
                </View>

                {/* Distance badge */}
                {shelter.distance !== undefined && (
                    <View style={[styles.distanceBadge, { backgroundColor: getDistanceColor(shelter.distance) + '20' }]}>
                        <MaterialCommunityIcons
                            name="map-marker-distance"
                            size={16}
                            color={getDistanceColor(shelter.distance)}
                        />
                        <Text
                            variant="bodyMedium"
                            style={[styles.distanceText, { color: getDistanceColor(shelter.distance) }]}
                        >
                            {formatDistance(shelter.distance)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Facilities chips */}
            {shelter.facilities.length > 0 && (
                <View style={styles.facilitiesRow}>
                    {shelter.facilities.slice(0, 3).map((fac, idx) => (
                        <Chip key={idx} style={styles.miniChip} textStyle={styles.chipText} height={24}>
                            {fac}
                        </Chip>
                    ))}
                    {shelter.facilities.length > 3 && (
                        <Text variant="bodySmall" style={styles.moreText}>
                            +{shelter.facilities.length - 3}
                        </Text>
                    )}
                </View>
            )}

            {/* View details button */}
            <AppButton
                mode="text"
                text="View Details"
                onPress={onPress}
                style={styles.detailsButton}
            />
        </AppCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
    },
    shelterName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        // gap: 8, replaced
        flexWrap: 'wrap',
    },
    infoBadge: {
        marginRight: 8, // gap replacement
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    bedText: {
        marginLeft: 4,
        fontWeight: 'bold',
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8, // gap replacement for distance badge if needed
    },
    distanceText: {
        marginLeft: 4,
        fontWeight: 'bold',
    },
    nearestCard: {
        borderWidth: 2,
        borderColor: '#10b981', // Could use theme.colors.nearestShelter but this is outside component. 
        // Ideally we pass theme or use inline styles for dynamic colors.
        backgroundColor: '#ecfdf5',
    },
    nearestBadgeContainer: {
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    nearestBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        // gap: 4, replaced
    },
    nearestText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
    facilitiesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // gap: 6, replaced
    },
    miniChip: {
        backgroundColor: '#e6f0ff',
        height: 26,
        marginRight: 6, // gap replacement
        marginBottom: 6, // for wrapping
    },
    chipText: {
        fontSize: 10,
        lineHeight: 10,
    },
    moreText: {
        alignSelf: 'center',
        color: 'gray',
    },
    detailsButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: -8,
    },
});

export default ShelterCard;
