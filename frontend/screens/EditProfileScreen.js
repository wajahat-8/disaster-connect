import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, Text, useTheme, ActivityIndicator, IconButton, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput'; // Reusing our custom input

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location?.address || user?.location || '',
    role: user?.role || 'user',
    skills: user?.skills ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills) : '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
  });
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const safeTrim = (v) => {
    if (v == null) return '';
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'object') {
      if (v.address && typeof v.address === 'string') return v.address.trim();
      if ((v.lat || v.latitude) && (v.lng || v.longitude)) {
        const lat = v.lat || v.latitude;
        const lng = v.lng || v.longitude;
        return `${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
      }
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v).trim();
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', phone: '', location: '', skills: '' };
    let isValid = true;

    const nameVal = safeTrim(form.name);
    if (!nameVal) { newErrors.name = 'Name is required'; isValid = false; }
    else if (nameVal.length < 2) { newErrors.name = 'Name must be at least 2 characters'; isValid = false; }

    const emailVal = safeTrim(form.email);
    if (!emailVal) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!validateEmail(emailVal)) { newErrors.email = 'Please enter a valid email address'; isValid = false; }

    const phoneVal = safeTrim(form.phone);
    if (phoneVal && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(phoneVal)) { newErrors.phone = 'Please enter a valid phone number'; isValid = false; }

    const skillsVal = safeTrim(form.skills);
    if (form.role === 'volunteer' && !skillsVal) { newErrors.skills = 'Please add at least one skill'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const profileData = {
        name: safeTrim(form.name),
        email: safeTrim(form.email),
        phone: safeTrim(form.phone),
        location: safeTrim(form.location),
        role: form.role,
      };

      if (form.role === 'volunteer' && safeTrim(form.skills)) {
        profileData.skills = form.skills.split(',').map(skill => safeTrim(skill)).filter(skill => skill.length > 0);
      } else if (form.role === 'user') {
        profileData.skills = []; // Clear skills if reverting to user
      }

      const result = await updateProfile(profileData);

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeVolunteer = () => {
    Alert.alert(
      'Become a Volunteer',
      'Are you sure you want to become a volunteer? You can help others during emergencies and disasters.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Continue', onPress: () => setForm({ ...form, role: 'volunteer' }) },
      ]
    );
  };

  const handleStopVolunteering = () => {
    Alert.alert(
      'Stop Volunteering?',
      'Are you sure you want to stop being a volunteer? You will lose access to volunteer tasks.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Stop',
          style: 'destructive',
          onPress: () => setForm({ ...form, role: 'user', skills: '' })
        },
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const generatePickerMapHTML = () => {
    // NOTE: replace YOUR_GOOGLE_MAPS_API_KEY with a valid key
    const locStr = safeTrim(form.location);
    let centerLat = 37.78825;
    let centerLng = -122.4324;

    if (locStr && locStr.includes(',')) {
      const parts = locStr.split(',').map(p => p.trim());
      const maybeLat = parseFloat(parts[0]);
      const maybeLng = parseFloat(parts[1]);
      if (!isNaN(maybeLat) && !isNaN(maybeLng)) {
        centerLat = maybeLat;
        centerLng = maybeLng;
      }
    } else if (user?.location && typeof user.location === 'object') {
      const lat = user.location.lat || user.location.latitude;
      const lng = user.location.lng || user.location.longitude;
      if (lat && lng) {
        centerLat = Number(lat);
        centerLng = Number(lng);
      }
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map; let marker;
            function initMap() {
              map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: ${centerLat}, lng: ${centerLng} },
                zoom: 12,
              });
              map.addListener('click', function(e) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                if (marker) marker.setMap(null);
                marker = new google.maps.Marker({ position: { lat, lng }, map });
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pickLocation', lat, lng }));
              });
            }
          </script>
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap" async defer></script>
        </body>
      </html>
    `;
  };

  const handlePickerMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'pickLocation') {
        const lat = data.lat;
        const lng = data.lng;
        const locString = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        setForm({ ...form, location: locString });
        setMapModalVisible(false);
      }
    } catch (error) {
      console.error('Error parsing picker message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} size={24} />
          <Text variant="headlineSmall" style={styles.title}>Edit Profile</Text>
        </View>

        <FormInput
          label="Full Name"
          value={form.name}
          onChangeText={(v) => handleInputChange('name', v)}
          error={errors.name}
        />

        <FormInput
          label="Email Address"
          value={form.email}
          onChangeText={(v) => handleInputChange('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <FormInput
          label="Phone Number"
          value={form.phone}
          onChangeText={(v) => handleInputChange('phone', v)}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <View style={styles.locationContainer}>
          <FormInput
            label="Location"
            value={form.location}
            onChangeText={(v) => handleInputChange('location', v)}
            error={errors.location}
            style={{ flex: 1 }}
          />
          <Button mode="outlined" onPress={() => setMapModalVisible(true)} style={styles.mapBtn}>
            Map
          </Button>
        </View>

        {form.role === 'user' && (
          <View style={[styles.volunteerSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
            <Text variant="titleMedium" style={{ marginBottom: 5 }}>Become a Volunteer</Text>
            <Text variant="bodyMedium" style={{ marginBottom: 15, color: theme.colors.onSurfaceVariant }}>
              As a volunteer, you can help others during disasters and emergencies.
            </Text>
            <Button mode="contained-tonal" onPress={handleBecomeVolunteer}>
              Sign Up as Volunteer
            </Button>
          </View>
        )}

        {(form.role === 'volunteer') && (
          <View style={styles.section}>
            <Text variant="labelLarge" style={{ color: theme.colors.primary, marginBottom: 5 }}>
              🎗️ You are a Volunteer
            </Text>
            <FormInput
              label="Skills (comma separated)"
              value={form.skills}
              onChangeText={(v) => handleInputChange('skills', v)}
              multiline
              error={errors.skills}
            />
            <HelperText type="info">Example: First Aid, Driving, Cooking</HelperText>

            <Button
              mode="outlined"
              textColor={theme.colors.error}
              style={{ marginTop: 10, borderColor: theme.colors.error }}
              onPress={handleStopVolunteering}
            >
              Stop Volunteering (Revert to User)
            </Button>
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          icon="content-save"
          style={styles.saveButton}
        >
          Save Changes
        </Button>

      </ScrollView>

      <Modal
        visible={mapModalVisible}
        animationType="slide"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: generatePickerMapHTML() }}
            onMessage={handlePickerMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <Button mode="contained" onPress={() => setMapModalVisible(false)} style={{ margin: 20 }}>
            Close Map
          </Button>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // balance back icon
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mapBtn: {
    marginTop: 6,
  },
  volunteerSection: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    marginVertical: 15,
  },
  section: {
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 5,
  },
});