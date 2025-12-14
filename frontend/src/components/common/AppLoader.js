import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ActivityIndicator, Text, useTheme, Surface } from 'react-native-paper';

export default function AppLoader({
    visible = true,
    overlay = false,
    message = 'Loading...',
    style,
}) {
    const theme = useTheme();

    if (!visible) return null;

    if (overlay) {
        return (
            <Modal transparent animationType="fade" visible={visible}>
                <View style={styles.overlayContainer}>
                    <Surface style={styles.surface} elevation={4}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        {message && (
                            <Text variant="bodyMedium" style={styles.message}>
                                {message}
                            </Text>
                        )}
                    </Surface>
                </View>
            </Modal>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            {message && (
                <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.secondary }]}>
                    {message}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    surface: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        minWidth: 150,
    },
    message: {
        marginTop: 12,
        fontWeight: '500',
    },
});
