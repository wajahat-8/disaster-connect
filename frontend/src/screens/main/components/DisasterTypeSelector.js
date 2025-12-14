import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import AppCard from '../../../components/common/AppCard';

const DISASTER_TYPES = ['flood', 'earthquake', 'fire', 'storm', 'landslide', 'other'];

/**
 * Chip selector for disaster type.
 * @param {Object} props
 * @param {string} props.selectedType - Currently selected disaster type
 * @param {Function} props.onTypeChange - Callback when type changes
 */
const DisasterTypeSelector = ({ selectedType, onTypeChange }) => {
    const theme = useTheme();

    return (
        <AppCard>
            <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>
                Disaster Type
            </Text>
            <View style={styles.chipContainer}>
                {DISASTER_TYPES.map(type => (
                    <Chip
                        key={type}
                        selected={selectedType === type}
                        onPress={() => onTypeChange(type)}
                        style={styles.chip}
                        showSelectedOverlay
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Chip>
                ))}
            </View>
        </AppCard>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        marginBottom: 4,
    },
});

export default DisasterTypeSelector;
