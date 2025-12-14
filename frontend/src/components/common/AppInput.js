import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';

export default function AppInput({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    leftIcon,
    rightIcon,
    disabled = false,
    multiline = false,
    numberOfLines = 1,
    style,
    ...props
}) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                disabled={disabled}
                multiline={multiline}
                numberOfLines={numberOfLines}
                mode="outlined"
                error={!!error}
                style={[styles.input, style]}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                left={leftIcon ? <TextInput.Icon icon={leftIcon} color={theme.colors.secondary} /> : null}
                right={rightIcon ? <TextInput.Icon icon={rightIcon} color={theme.colors.secondary} /> : null}
                {...props}
            />
            {error ? (
                <HelperText type="error" visible={!!error}>
                    {error}
                </HelperText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#fff',
    },
});
