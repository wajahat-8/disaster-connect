import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, Chip, ActivityIndicator, HelperText, IconButton, Surface } from 'react-native-paper';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiClient';

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

  const requestPermissions = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (locationStatus !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is required to report disasters');
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = geocode[0]
        ? `${geocode[0].street || ''} ${geocode[0].city || ''} ${geocode[0].region || ''}`.trim()
        : '';

      setForm({
        ...form,
        coordinates: { latitude, longitude },
        address
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const processImageResult = (result) => {
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enables cropping
        quality: 0.8,
      });
      processImageResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Enables cropping
        quality: 0.8,
      });
      processImageResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSubmit = async () => {
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

      const response = await api.post('/disasters', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Disaster Type Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>Disaster Type</Text>
        <View style={styles.chipContainer}>
          {['flood', 'earthquake', 'fire', 'storm', 'landslide', 'other'].map(type => (
            <Chip
              key={type}
              selected={form.type === type}
              onPress={() => setForm({ ...form, type })}
              style={styles.chip}
              showSelectedOverlay
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      {/* Severity Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>Severity</Text>
        <View style={styles.chipContainer}>
          {['low', 'medium', 'high', 'critical'].map(severity => (
            <Chip
              key={severity}
              selected={form.severity === severity}
              onPress={() => setForm({ ...form, severity })}
              style={styles.chip}
              selectedColor={form.severity === severity && severity === 'critical' ? theme.colors.error : undefined}
              showSelectedOverlay
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <TextInput
          label="Description"
          mode="outlined"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          multiline
          numberOfLines={4}
          style={{ backgroundColor: theme.colors.surface }}
        />
        <HelperText type="info">
          Describe the situation in detail.
        </HelperText>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>Location</Text>
        <Button
          mode="outlined"
          onPress={getCurrentLocation}
          loading={locationLoading}
          disabled={locationLoading}
          icon="crosshairs-gps"
        >
          {form.coordinates ? 'Update Location' : 'Get Current Location'}
        </Button>
        {form.address ? (
          <View style={styles.addressBox}>
            <IconButton icon="map-marker" size={20} />
            <Text variant="bodySmall" style={{ flex: 1, fontStyle: 'italic' }}>{form.address}</Text>
          </View>
        ) : null}
      </View>

      {/* Improved Image Upload Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>Photo Evidence</Text>

        {image ? (
          <Surface style={styles.imagePreviewContainer} elevation={2}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            <View style={styles.imageActions}>
              <Button
                mode="contained-tonal"
                icon="crop"
                onPress={() => Alert.alert('Edit Image', 'Choose an option to crop/edit', [
                  { text: 'Gallery', onPress: pickImage },
                  { text: 'Camera', onPress: takePhoto },
                  { text: 'Cancel', style: 'cancel' }
                ])}
                style={{ flex: 1, marginRight: 5 }}
              >
                Edit / Crop
              </Button>
              <Button
                mode="contained"
                buttonColor={theme.colors.error}
                icon="delete"
                onPress={() => setImage(null)}
              >
                Remove
              </Button>
            </View>
          </Surface>
        ) : (
          <TouchableOpacity style={styles.uploadPlaceholder} onPress={() => { }}>
            <IconButton icon="cloud-upload" size={40} iconColor={theme.colors.primary} />
            <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>Tap below to upload photo</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 15 }}>You can crop the image after selecting</Text>

            <View style={styles.uploadButtonsRow}>
              <Button mode="outlined" icon="image" onPress={pickImage} style={styles.uploadBtn}>
                Gallery
              </Button>
              <Button mode="contained" icon="camera" onPress={takePhoto} style={styles.uploadBtn}>
                Camera
              </Button>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        contentStyle={{ paddingVertical: 5 }}
      >
        Report Disaster
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 10,
    paddingRight: 10
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginTop: 5,
  },
  uploadBtn: {
    flex: 1,
  },
  submitButton: {
    marginTop: 10,
  },
});
