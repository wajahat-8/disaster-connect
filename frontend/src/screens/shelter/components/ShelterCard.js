import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppCard from '../../../components/common/AppCard';
import AppButton from '../../../components/common/AppButton';

/**
 * Get capacity color based on availability ratio.
 */
const getCapacityColor = (available, total, theme) => {
    const ratio = available / total;
    if (ratio < 0.2) return theme.colors.error;
    if (ratio < 0.5) return theme.colors.warning;
    return theme.colors.success;
};

/**
 * Card component for displaying a shelter in a list.
 * @param {Object} props
 * @param {Object} props.shelter - Shelter data object
 * @param {Function} props.onPress - Callback when card is pressed
 */
const ShelterCard = ({ shelter, onPress }) => {
    const theme = useTheme();

    return (
        <AppCard onPress={onPress} style={styles.card}>
            {/* Header with name and verified badge */}
            <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={styles.shelterName}>{shelter.name}</Text>
                {shelter.verified && (
                    <MaterialCommunityIcons name="check-decagram" size={20} color={theme.colors.primary} />
                )}
            </View>

            {/* Bed availability */}
            <View style={styles.infoRow}>
                <View style={styles.infoBadge}>
                    <MaterialCommunityIcons name="bed" size={16} color="#666" />
                    <Text
                        variant="bodyMedium"
                        style={[styles.bedText, { color: getCapacityColor(shelter.availableBeds, shelter.capacity, theme) }]}
                    >
                        {shelter.availableBeds} / {shelter.capacity} Beds
                    </Text>
                </View>
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
        alignItems: 'center',
        marginBottom: 8,
    },
    shelterName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBadge: {
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
    facilitiesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    miniChip: {
        backgroundColor: '#e6f0ff',
        height: 26,
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
