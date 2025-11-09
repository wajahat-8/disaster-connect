import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// Remove the Ionicons import for now, or install the package
// import Ionicons from '@expo/vector-icons/Ionicons';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    role: user?.role || 'user',
    skills: user?.skills?.join(', ') || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      location: '',
    };

    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation (optional)
    if (form.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile(form);
      
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
  <TouchableOpacity 
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="arrow-back" size={24} color="black" />
  </TouchableOpacity>

  <Text style={styles.title}>Edit Profile</Text>
  <View style={styles.placeholder} />
</View>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputTextError : null]}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputTextError : null]}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={form.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, errors.phone ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>📞</Text>
              <TextInput
                style={[styles.input, errors.phone ? styles.inputTextError : null]}
                placeholder="Phone Number (Optional)"
                placeholderTextColor="#999"
                value={form.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, errors.location ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={[styles.input, errors.location ? styles.inputTextError : null]}
                placeholder="Location (Optional)"
                placeholderTextColor="#999"
                value={form.location}
                onChangeText={(value) => handleInputChange('location', value)}
                autoComplete="address-line1"
              />
            </View>
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
          </View>

          {/* Volunteer Section */}
          {form.role === 'user' && (
            <View style={styles.volunteerSection}>
              <Text style={styles.sectionTitle}>Become a Volunteer</Text>
              <Text style={styles.sectionDescription}>
                As a volunteer, you can help others during disasters and emergencies.
              </Text>
              <TouchableOpacity
                style={styles.volunteerButton}
                onPress={() => setForm({ ...form, role: 'volunteer' })}
              >
                <Text style={styles.volunteerButtonText}>Sign Up as Volunteer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Skills Input - Show only if volunteer */}
          {(form.role === 'volunteer' || user?.role === 'volunteer') && (
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, errors.skills ? styles.inputError : null]}>
                <Text style={styles.inputIcon}>🛠️</Text>
                <TextInput
                  style={[styles.input, errors.skills ? styles.inputTextError : null]}
                  placeholder="Skills (comma separated)"
                  placeholderTextColor="#999"
                  value={form.skills}
                  onChangeText={(value) => handleInputChange('skills', value)}
                  multiline={true}
                />
              </View>
              {errors.skills ? <Text style={styles.errorText}>{errors.skills}</Text> : null}
              <Text style={styles.helperText}>
                Example: First Aid, Driving, Cooking, Construction, etc.
              </Text>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>💾</Text>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  volunteerSection: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 16,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  volunteerButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  volunteerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 16,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f3f4',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  inputError: {
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.1,
  },
  inputTextError: {
    color: '#FF3B30',
  },
  inputIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});