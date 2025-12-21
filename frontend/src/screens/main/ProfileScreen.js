import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Text, useTheme, Divider } from 'react-native-paper';
import { useAuth } from '../../auth';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={(user?.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            style={{ backgroundColor: theme.colors.primaryContainer, marginBottom: 15 }}
            color={theme.colors.onPrimaryContainer}
          />
          <Text variant="headlineSmall" style={styles.name}>{user?.name || 'Unnamed User'}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>
              {(user?.role || 'user').toUpperCase()}
            </Text>
          </View>
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 15 }}>Contact Information</Text>

        <View style={styles.row}>
          <Text variant="bodyMedium" style={styles.label}>Email</Text>
          <Text variant="bodyLarge">{user?.email || '—'}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.row}>
          <Text variant="bodyMedium" style={styles.label}>Phone</Text>
          <Text variant="bodyLarge">{user?.phone || '—'}</Text>
        </View>
        <Divider style={styles.divider} />

        {user?.location && (
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>Location</Text>
            <Text variant="bodyLarge">{typeof user.location === 'string' ? user.location : (user.location.address || '—')}</Text>
          </View>
        )}
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          mode="contained"
          text="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          icon="account-edit"
        />

        <AppButton
          mode="outlined"
          text="Logout"
          onPress={logout}
          icon="logout"
          style={{ borderColor: theme.colors.error, marginTop: 10 }}
          labelStyle={{ color: theme.colors.error }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    color: '#666',
    marginBottom: 2,
  },
  divider: {
    marginVertical: 10,
  },
  actions: {
    marginTop: 10,
  },
});
