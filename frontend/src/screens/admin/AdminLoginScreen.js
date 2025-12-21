import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../auth';

/**
 * Admin Login Screen
 * Simple login form specifically for admin access
 * Uses the same login API but emphasizes admin authentication
 */
export default function AdminLoginScreen({ navigation }) {
    const { login } = useAuth();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result.success) {
                Alert.alert('Login Failed', result.error || 'Invalid credentials');
            } else if (result.user?.role !== 'admin') {
                Alert.alert('Access Denied', 'Admin privileges required');
                await logout();
            }
        } catch (error) {
            console.error('Admin login error:', error);
            Alert.alert('Error', 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Admin Login
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Access admin dashboard and management tools
                        </Text>
                    </View>

                    <AppInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="email"
                        placeholder="admin@example.com"
                        style={styles.input}
                    />

                    <AppInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        leftIcon="lock"
                        placeholder="Enter password"
                        style={styles.input}
                    />

                    <AppButton
                        mode="contained"
                        text="Login as Admin"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        icon="shield-account"
                        style={styles.button}
                    />

                    <AppButton
                        mode="text"
                        text="Back to Regular Login"
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                        style={styles.backButton}
                    />
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        elevation: 4,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        color: '#7f8c8d',
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
    backButton: {
        marginTop: 5,
    },
});
