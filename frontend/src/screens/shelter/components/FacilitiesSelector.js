import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip, Surface } from 'react-native-paper';

const FACILITY_OPTIONS = [
    { label: 'Food', icon: 'food' },
    { label: 'Water', icon: 'water' },
    { label: 'Medical', icon: 'doctor' },
    { label: 'Wifi', icon: 'wifi' },
    { label: 'Showers', icon: 'shower' },
    { label: 'Power', icon: 'power-plug' },
    { label: 'Beds', icon: 'bed' },
    { label: 'Kids Zone', icon: 'baby-carriage' }
];

/**
 * Facility selector component with chip toggle interface.
 * @param {Object} props
 * @param {Array} props.selectedFacilities - Array of selected facility labels
 * @param {Function} props.onFacilitiesChange - Callback when facilities change
 */
const FacilitiesSelector = ({ selectedFacilities, onFacilitiesChange }) => {
    const toggleFacility = (facLabel) => {
        if (selectedFacilities.includes(facLabel)) {
            onFacilitiesChange(selectedFacilities.filter(f => f !== facLabel));
        } else {
            onFacilitiesChange([...selectedFacilities, facLabel]);
        }
    };

    return (
        <Surface style={styles.facilitiesContainer} elevation={0}>
            {FACILITY_OPTIONS.map(fac => (
                <Chip
                    key={fac.label}
                    selected={selectedFacilities.includes(fac.label)}
                    onPress={() => toggleFacility(fac.label)}
                    style={styles.chip}
                    showSelectedOverlay
                    mode="outlined"
                    icon={fac.icon}
                >
                    {fac.label}
                </Chip>
            ))}
        </Surface>
    );
};

const styles = StyleSheet.create({
    facilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: 'white',
    },
});

export default FacilitiesSelector;
