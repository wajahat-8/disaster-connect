import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { useAuthForm } from '../../hooks/useAuthForm';

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const { submit, loading, error } = useAuthForm(true); // true for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await submit({ email, password });
    if (success) {
      // Navigation is handled by AppNavigator listening to auth state
    } else if (error) {
      Alert.alert('Login Failed', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.textSecondary || 'gray' }]}>
            Sign in to continue
          </Text>

          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
          />

          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock"
          />

          {error ? (
            <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 10 }}>
              {error}
            </Text>
          ) : null}

          <AppButton
            mode="contained"
            text="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <AppButton
            mode="text"
            text="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
          />

          <AppButton
            mode="text"
            text="Don't have an account? Register"
            onPress={() => navigation.navigate('Register')}
            style={styles.textButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: 'gray',
  },
  button: {
    marginTop: 10,
  },
  textButton: {
    marginTop: 10,
  }
});
