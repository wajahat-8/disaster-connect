import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, useTheme, Chip, Surface, HelperText } from 'react-native-paper';
import FormInput from '../../components/FormInput';
import { createShelter } from '../../api/shelterApi';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

    // Default to 0,0 
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [locationCaptured, setLocationCaptured] = useState(false);

    // Common facilities options
    const facilityOptions = [
        { label: 'Food', icon: 'food' },
        { label: 'Water', icon: 'water' },
        { label: 'Medical', icon: 'doctor' },
        { label: 'Wifi', icon: 'wifi' },
        { label: 'Showers', icon: 'shower' },
        { label: 'Power', icon: 'power-plug' },
        { label: 'Beds', icon: 'bed' },
        { label: 'Kids Zone', icon: 'baby-carriage' }
    ];

    const toggleFacility = (facLabel) => {
        if (facilities.includes(facLabel)) {
            setFacilities(facilities.filter(f => f !== facLabel));
        } else {
            setFacilities([...facilities, facLabel]);
        }
    };

    const getCurrentLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to tag the shelter.');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude
            });
            setLocationCaptured(true);
        } catch (e) {
            Alert.alert('Error', 'Could not fetch location. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
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
                contactInfo: {
                    phone,
                    email
                },
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Register New Shelter</Text>
                    <Text variant="bodySmall" style={{ color: 'gray' }}>Enter details and location for the new shelter.</Text>
                </View>

                <Surface style={styles.formSection} elevation={1}>
                    <FormInput
                        label="Shelter Name"
                        value={name}
                        onChangeText={setName}
                        leftIcon="home-group"
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <FormInput
                                label="Total Capacity"
                                value={capacity}
                                onChangeText={setCapacity}
                                keyboardType="numeric"
                                leftIcon="account-group"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput
                                label="Available Beds"
                                value={availableBeds}
                                onChangeText={setAvailableBeds}
                                keyboardType="numeric"
                                leftIcon="bed-empty"
                            />
                        </View>
                    </View>
                </Surface>

                <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
                <Surface style={styles.formSection} elevation={1}>
                    <FormInput
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        leftIcon="phone"
                    />
                    <FormInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="email"
                    />
                </Surface>

                <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
                <Surface style={styles.locationCard} elevation={1}>
                    <View style={styles.locationInfo}>
                        <MaterialCommunityIcons
                            name={locationCaptured ? "map-marker-check" : "map-marker-off"}
                            size={30}
                            color={locationCaptured ? "green" : "gray"}
                        />
                        <View style={{ marginLeft: 15, flex: 1 }}>
                            {locationCaptured ? (
                                <>
                                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Location Captured</Text>
                                    <Text variant="bodySmall" style={{ color: 'gray' }}>Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}</Text>
                                </>
                            ) : (
                                <Text variant="bodyMedium" style={{ color: 'gray' }}>No location set</Text>
                            )}
                        </View>
                    </View>
                    <Button
                        mode={locationCaptured ? "outlined" : "contained"}
                        onPress={getCurrentLocation}
                        loading={loading}
                        icon="crosshairs-gps"
                        style={{ marginTop: 10 }}
                    >
                        {locationCaptured ? "Update Location" : "Capture Location"}
                    </Button>
                </Surface>

                <Text variant="titleMedium" style={styles.sectionTitle}>Facilities</Text>
                <Surface style={styles.facilitiesContainer} elevation={0}>
                    {facilityOptions.map(fac => (
                        <Chip
                            key={fac.label}
                            selected={facilities.includes(fac.label)}
                            onPress={() => toggleFacility(fac.label)}
                            style={styles.chip}
                            showSelectedOverlay
                            mode="outlined"
                            icon={fac.icon}
                        >
                            {fac.label}
                        </Chip>
                    ))}
                </Surface>

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
    formSection: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        marginLeft: 5,
        color: '#444',
    },
    locationCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    facilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: 'white',
    },
    submitButton: {
        marginTop: 10,
        marginBottom: 50,
        borderRadius: 10,
    }
});
