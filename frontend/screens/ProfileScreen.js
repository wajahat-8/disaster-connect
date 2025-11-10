import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name: {user?.name}</Text>
      <Text style={styles.label}>Email: {user?.email}</Text>
      {user?.phone && <Text style={styles.label}>Phone: {user.phone}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 15,
    width: '100%',
    maxWidth: 300,
  },
});
