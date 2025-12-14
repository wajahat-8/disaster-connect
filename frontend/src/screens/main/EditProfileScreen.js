import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useAuth } from '../../auth';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { LocationPickerModal, VolunteerSection } from './components';

/**
 * Screen for editing user profile information.
 * Allows users to update name, email, phone, location.
 * Volunteers can manage their skills, and users can become volunteers.
 */
export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location?.address || user?.location || '',
    role: user?.role || 'user',
    skills: user?.skills ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills) : '',
  });

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
  });

  // ============ Helpers ============

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ============ Validation ============

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
    if (phoneVal && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(phoneVal)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    const skillsVal = safeTrim(form.skills);
    if (form.role === 'volunteer' && !skillsVal) {
      newErrors.skills = 'Please add at least one skill';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ============ Handlers ============

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
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
        profileData.skills = [];
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

  const handleLocationSelected = (lat, lng) => {
    const locString = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    setForm({ ...form, location: locString });
  };

  // Get initial coordinates for map
  const getInitialCoords = () => {
    const locStr = safeTrim(form.location);
    if (locStr && locStr.includes(',')) {
      const parts = locStr.split(',').map(p => p.trim());
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    if (user?.location && typeof user.location === 'object') {
      const lat = user.location.lat || user.location.latitude;
      const lng = user.location.lng || user.location.longitude;
      if (lat && lng) return { lat: Number(lat), lng: Number(lng) };
    }
    return { lat: 37.78825, lng: -122.4324 };
  };

  const coords = getInitialCoords();

  // ============ Render ============

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} size={24} />
          <Text variant="headlineSmall" style={styles.title}>Edit Profile</Text>
        </View>

        {/* Form Fields */}
        <AppInput
          label="Full Name"
          value={form.name}
          onChangeText={(v) => handleInputChange('name', v)}
          error={errors.name}
        />

        <AppInput
          label="Email Address"
          value={form.email}
          onChangeText={(v) => handleInputChange('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <AppInput
          label="Phone Number"
          value={form.phone}
          onChangeText={(v) => handleInputChange('phone', v)}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        {/* Location with Map Picker */}
        <View style={styles.locationContainer}>
          <AppInput
            label="Location"
            value={form.location}
            onChangeText={(v) => handleInputChange('location', v)}
            error={errors.location}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <AppButton
            mode="outlined"
            text="Map"
            onPress={() => setMapModalVisible(true)}
            style={styles.mapBtn}
            contentStyle={{ height: 50 }}
          />
        </View>

        {/* Volunteer Section */}
        <VolunteerSection
          currentRole={form.role}
          skills={form.skills}
          skillsError={errors.skills}
          onSkillsChange={(v) => handleInputChange('skills', v)}
          onBecomeVolunteer={handleBecomeVolunteer}
          onStopVolunteering={handleStopVolunteering}
        />

        {/* Save Button */}
        <AppButton
          mode="contained"
          text="Save Changes"
          onPress={handleSave}
          loading={loading}
          icon="content-save"
          style={styles.saveButton}
        />
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onLocationSelected={handleLocationSelected}
        initialLat={coords.lat}
        initialLng={coords.lng}
      />
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
    marginRight: 32,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  mapBtn: {
    marginTop: 6,
    width: 80,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
  },
});