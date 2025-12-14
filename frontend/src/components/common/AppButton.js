import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function AppButton({
    mode = 'contained',
    text,
    onPress,
    loading = false,
    disabled = false,
    icon,
    style,
    contentStyle,
    labelStyle,
    ...props
}) {
    const theme = useTheme();

    return (
        <Button
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled || loading}
            icon={icon}
            style={[
                styles.button,
                mode === 'contained' && { backgroundColor: theme.colors.primary },
                mode === 'outlined' && { borderColor: theme.colors.primary },
                style,
            ]}
            contentStyle={[styles.content, contentStyle]}
            labelStyle={[
                styles.label,
                mode === 'text' && { color: theme.colors.primary },
                labelStyle
            ]}
            {...props}
        >
            {text}
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        marginVertical: 8,
    },
    content: {
        height: 48,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
