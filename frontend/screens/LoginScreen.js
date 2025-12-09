import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, useTheme, Headline } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import api from '../api/apiClient';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const theme = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        return;
      }
      setError(result.error || 'Login failed. Please try again.');
      Alert.alert('Login Error', result.error || 'Login failed. Please try again.');
    } catch (e) {
      const message = e?.message || 'Login failed. Please try again.';
      // DEBUG: Show where it tried to connect
      const debugMsg = `${message}\n\nTarget: ${api.defaults.baseURL}`;
      setError(debugMsg);
      Alert.alert('Login Error', debugMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Welcome Back
      </Text>

      <FormInput
        label="Email"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormInput
        label="Password"
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
        secureTextEntry
      />

      {error ? (
        <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 10 }}>
          {error}
        </Text>
      ) : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={{ marginTop: 10 }}
      >
        Forgot Password?
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.textButton}
      >
        Don't have an account? Register
      </Button>
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
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  textButton: {
    marginTop: 10,
  }
});
