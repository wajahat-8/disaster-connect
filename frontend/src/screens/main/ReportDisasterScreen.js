import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme, HelperText } from 'react-native-paper';
import * as Location from 'expo-location';
import { useAuth } from '../../auth';
import apiClient from '../../api/apiClient';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import {
  DisasterTypeSelector,
  SeveritySelector,
  ImageUploader,
  LocationPicker
} from './components';

/**
 * Screen for reporting a disaster incident.
 * Allows users to specify type, severity, description, location, and upload photos.
 */
export default function ReportDisasterScreen({ navigation }) {
  const { user } = useAuth();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'flood',
    description: '',
    severity: 'medium',
    coordinates: null,
    address: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  // ============ Permissions ============

  const requestPermissions = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is required to report disasters');
    }
  };

  // ============ Handlers ============

  const handleLocationChange = ({ coordinates, address }) => {
    setForm({ ...form, coordinates, address });
    setLocationLoading(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    if (!form.coordinates) {
      Alert.alert('Error', 'Please get your location first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('severity', form.severity);
      formData.append('coordinates', JSON.stringify([form.coordinates.longitude, form.coordinates.latitude]));
      formData.append('address', form.address);

      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', {
          uri: image,
          name: filename,
          type
        });
      }

      const response = await apiClient.post('/disasters', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        Alert.alert('Success', 'Disaster reported successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Report disaster error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to report disaster');
    } finally {
      setLoading(false);
    }
  };

  // ============ Render ============

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Disaster Type */}
      <DisasterTypeSelector
        selectedType={form.type}
        onTypeChange={(type) => setForm({ ...form, type })}
      />

      {/* Severity */}
      <SeveritySelector
        selectedSeverity={form.severity}
        onSeverityChange={(severity) => setForm({ ...form, severity })}
      />

      {/* Description */}
      <AppCard>
        <AppInput
          label="Description"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          multiline
          numberOfLines={4}
          style={{ backgroundColor: theme.colors.surface }}
        />
        <HelperText type="info">
          Describe the situation in detail.
        </HelperText>
      </AppCard>

      {/* Location */}
      <LocationPicker
        coordinates={form.coordinates}
        address={form.address}
        loading={locationLoading}
        onLocationChange={handleLocationChange}
      />

      {/* Photo Upload */}
      <ImageUploader
        imageUri={image}
        onImageChange={setImage}
      />

      {/* Submit Button */}
      <AppButton
        mode="contained"
        text="Report Disaster"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        contentStyle={{ paddingVertical: 5 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    marginTop: 10,
  },
});
