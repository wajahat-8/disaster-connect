import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

export default function FormInput({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    ...props
}) {
    return (
        <View style={styles.container}>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                mode="outlined"
                error={!!error}
                style={styles.input}
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
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
    },
});
