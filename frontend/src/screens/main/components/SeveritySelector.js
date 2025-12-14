import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import AppCard from '../../../components/common/AppCard';

const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

/**
 * Chip selector for disaster severity level.
 * @param {Object} props
 * @param {string} props.selectedSeverity - Currently selected severity
 * @param {Function} props.onSeverityChange - Callback when severity changes
 */
const SeveritySelector = ({ selectedSeverity, onSeverityChange }) => {
    const theme = useTheme();

    return (
        <AppCard>
            <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>
                Severity
            </Text>
            <View style={styles.chipContainer}>
                {SEVERITY_LEVELS.map(severity => (
                    <Chip
                        key={severity}
                        selected={selectedSeverity === severity}
                        onPress={() => onSeverityChange(severity)}
                        style={styles.chip}
                        selectedColor={selectedSeverity === severity && severity === 'critical' ? theme.colors.error : undefined}
                        showSelectedOverlay
                    >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
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

export default SeveritySelector;
