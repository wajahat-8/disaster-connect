import React from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';

/**
 * Component displayed when location permission is denied or unavailable.
 * Provides user-friendly guidance and a button to open device settings.
 * 
 * @param {Object} props
 * @param {boolean} props.dismissible - Whether the component can be dismissed (optional)
 * @param {Function} props.onDismiss - Callback when dismissed (optional)
 */
export default function LocationPermissionPrompt({ dismissible = false, onDismiss }) {
    const theme = useTheme();

    const openLocationSettings = async () => {
        try {
            if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
            } else {
                await IntentLauncher.startActivityAsync(
                    IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
                );
            }
        } catch (error) {
            console.error('Error opening settings:', error);
            // Fallback to general settings
            if (Platform.OS === 'ios') {
                await Linking.openSettings();
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                <Ionicons name="location-outline" size={64} color={theme.colors.primary} />
            </View>

            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
                Location Access Required
            </Text>

            <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                This feature needs your location to show nearby shelters and disaster information.
                Please enable location services in your device settings.
            </Text>

            <Button
                mode="contained"
                icon="cog"
                onPress={openLocationSettings}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                Enable Location
            </Button>

            {dismissible && (
                <Button
                    mode="text"
                    onPress={onDismiss}
                    style={styles.dismissButton}
                >
                    Maybe Later
                </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        maxWidth: 320,
    },
    button: {
        borderRadius: 25,
        minWidth: 200,
    },
    buttonContent: {
        height: 50,
    },
    dismissButton: {
        marginTop: 12,
    },
});
