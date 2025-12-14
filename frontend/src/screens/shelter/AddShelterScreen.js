import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import AppInput from '../../components/common/AppInput';
import { createShelter } from '../../api/shelterApi';
import { LocationCapture, FacilitiesSelector } from './components';

/**
 * Screen for admins to add a new shelter.
 * Allows setting name, capacity, contact info, location, and facilities.
 */
export default function AddShelterScreen({ navigation }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [availableBeds, setAvailableBeds] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [locationCaptured, setLocationCaptured] = useState(false);

    // ============ Handlers ============

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
        setLocationCaptured(true);
    };

    const handleCreate = async () => {
        // Validation
        if (!name || !capacity || !availableBeds) {
            Alert.alert('Missing Fields', 'Please fill in Name, Capacity, and Available Beds.');
            return;
        }

        if (!locationCaptured && (location.lat === 0 && location.lng === 0)) {
            Alert.alert('Location Required', 'Please capture the shelter location.');
            return;
        }

        setLoading(true);
        try {
            const shelterData = {
                name,
                capacity: parseInt(capacity),
                availableBeds: parseInt(availableBeds),
                location: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat] // GeoJSON is [lng, lat]
                },
                facilities,
                contactInfo: { phone, email },
                verified: true
            };

            await createShelter(shelterData);
            Alert.alert('Success', 'Shelter added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to create shelter');
        } finally {
            setLoading(false);
        }
    };

    // ============ Render ============

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.primary }]}>
                        Register New Shelter
                    </Text>
                    <Text variant="bodySmall" style={styles.headerSubtitle}>
                        Enter details and location for the new shelter.
                    </Text>
                </View>

                {/* Basic Info Section */}
                <Surface style={styles.formSection} elevation={1}>
                    <AppInput
                        label="Shelter Name"
                        value={name}
                        onChangeText={setName}
                        leftIcon="home-group"
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <AppInput
                                label="Total Capacity"
                                value={capacity}
                                onChangeText={setCapacity}
                                keyboardType="numeric"
                                leftIcon="account-group"
                            />
                        </View>
                        <View style={styles.halfInputRight}>
                            <AppInput
                                label="Available Beds"
                                value={availableBeds}
                                onChangeText={setAvailableBeds}
                                keyboardType="numeric"
                                leftIcon="bed-empty"
                            />
                        </View>
                    </View>
                </Surface>

                {/* Contact Section */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
                <Surface style={styles.formSection} elevation={1}>
                    <AppInput
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        leftIcon="phone"
                    />
                    <AppInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="email"
                    />
                </Surface>

                {/* Location Section */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
                <LocationCapture
                    location={location}
                    locationCaptured={locationCaptured}
                    loading={loading}
                    onLocationChange={handleLocationChange}
                />

                {/* Facilities Section */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Facilities</Text>
                <FacilitiesSelector
                    selectedFacilities={facilities}
                    onFacilitiesChange={setFacilities}
                />

                {/* Submit Button */}
                <Button
                    mode="contained"
                    onPress={handleCreate}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                    contentStyle={{ height: 50 }}
                >
                    Create Shelter
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'gray',
    },
    formSection: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    halfInput: {
        flex: 1,
        marginRight: 10,
    },
    halfInputRight: {
        flex: 1,
    },
    sectionTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        marginLeft: 5,
        color: '#444',
    },
    submitButton: {
        marginTop: 10,
        marginBottom: 50,
        borderRadius: 10,
    },
});
