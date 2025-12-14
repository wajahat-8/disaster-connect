import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Get icon for a facility based on its name.
 */
const getFacilityIcon = (facility) => {
    const fac = facility.toLowerCase();
    if (fac.includes('medical') || fac.includes('doctor')) return 'doctor';
    if (fac.includes('food') || fac.includes('kitchen')) return 'food';
    if (fac.includes('water')) return 'water';
    if (fac.includes('bed') || fac.includes('sleep')) return 'bed';
    if (fac.includes('wifi') || fac.includes('internet')) return 'wifi';
    if (fac.includes('power') || fac.includes('charge')) return 'power-plug';
    if (fac.includes('shower') || fac.includes('bath')) return 'shower';
    if (fac.includes('kid') || fac.includes('child')) return 'baby-carriage';
    return 'check-circle-outline';
};

/**
 * Displays a list of shelter facilities as chips.
 * @param {Object} props
 * @param {Array} props.facilities - Array of facility names
 */
const FacilitiesList = ({ facilities }) => {
    const theme = useTheme();

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="domain" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.sectionTitle}>Facilities & Services</Text>
            </View>
            <View style={styles.facilitiesContainer}>
                {facilities.length > 0 ? (
                    facilities.map((fac, index) => (
                        <Chip
                            key={index}
                            style={styles.facilityChip}
                            icon={getFacilityIcon(fac)}
                            mode="flat"
                        >
                            {fac}
                        </Chip>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No specific facilities information available.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    facilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    facilityChip: {
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        color: 'gray',
        fontStyle: 'italic',
    },
});

export default FacilitiesList;
