import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAuthForm } from '../../hooks/useAuthForm'; // Updated import
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

export default function RegisterScreen({ navigation }) {
  const { submit, loading, error } = useAuthForm(false); // false for register
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const success = await submit(form);
    if (success) {
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Registration Error', error || 'Registration failed');
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
            Create Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Join the community today
          </Text>

          <AppInput
            label="Name"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
            leftIcon="account"
          />

          <AppInput
            label="Email"
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
          />

          <AppInput
            label="Phone"
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
            keyboardType="phone-pad"
            leftIcon="phone"
          />

          <AppInput
            label="Password"
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
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
            text="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />

          <AppButton
            mode="text"
            text="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.textButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
    color: '#757575', // textSecondary fallback
  },
  button: {
    marginTop: 10,
  },
  textButton: {
    marginTop: 10,
  },
});
