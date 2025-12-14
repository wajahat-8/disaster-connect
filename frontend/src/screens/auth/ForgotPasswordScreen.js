import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../auth';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import apiClient from '../../api/apiClient';

export default function ForgotPasswordScreen({ navigation }) {
    const theme = useTheme();

    // Step 1: Verification, Step 2: Reset
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleVerify = async () => {
        if (!name || !email) {
            setError('Please enter both Name and Email');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/verify-user', { name, email });
            if (response.data.success) {
                setStep(2);
                setError('');
            }
        } catch (e) {
            const msg = e.response?.data?.message || 'Verification failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setError('Please fill in required fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/reset-password', {
                email,
                password
            });

            if (response.data.success) {
                Alert.alert('Success', 'Your password has been reset successfully.', [
                    { text: 'Login Now', onPress: () => navigation.navigate('Login') }
                ]);
            }
        } catch (e) {
            const msg = e.response?.data?.message || 'Reset failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                    {step === 1 ? 'Find Account' : 'Reset Password'}
                </Text>

                {step === 1 ? (
                    <>
                        <Text style={styles.subtitle}>
                            Enter your name and email to find your account.
                        </Text>

                        <AppInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            leftIcon="account"
                        />

                        <AppInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon="email"
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.subtitle}>
                            Enter your new password below.
                        </Text>

                        <AppInput
                            label="New Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            leftIcon="lock"
                        />

                        <AppInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            leftIcon="lock-check"
                        />
                    </>
                )}

                {error ? (
                    <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 10 }}>
                        {error}
                    </Text>
                ) : null}

                <AppButton
                    mode="contained"
                    text={step === 1 ? 'Verify' : 'Update Password'}
                    onPress={step === 1 ? handleVerify : handleResetPassword}
                    loading={loading}
                    style={styles.button}
                />

                <AppButton
                    mode="text"
                    text="Cancel"
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                    style={styles.textButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    button: {
        marginTop: 10,
    },
    textButton: {
        marginTop: 10,
    }
});
