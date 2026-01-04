import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import { createDonation } from '../../api/donationApi';
import AppLoader from '../../components/common/AppLoader';
import LocationPermissionPrompt from '../../components/common/LocationPermissionPrompt';

const DonateScreen = ({ navigation }) => {
    const theme = useTheme();
    const [type, setType] = useState('money'); // 'money' or 'supplies'
    const [amount, setAmount] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
    const [address, setAddress] = useState('');
    const [manualAddress, setManualAddress] = useState('');

    useEffect(() => {
        initializeLocation();
    }, []);

    const initializeLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationPermissionDenied(true);
                return;
            }
            setLocationPermissionDenied(false);

            const userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setLocation(userLocation);

            // Get address
            const geocode = await Location.reverseGeocodeAsync({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude
            });

            if (geocode && geocode.length > 0) {
                const addr = geocode[0];
                const formattedAddress = `${addr.city || addr.subregion}, ${addr.region || addr.country}`;
                setAddress(formattedAddress);
            }

        } catch (error) {
            console.error('Location error:', error);
            // Don't block donation if location fails, just don't send it
        }
    };

    const handleSubmit = async () => {
        try {
            // Validation
            if (type === 'money') {
                if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                    Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
                    return;
                }
            } else {
                if (!itemDescription.trim()) {
                    Alert.alert('Missing Description', 'Please describe the supplies you wish to donate.');
                    return;
                }
            }

            setLoading(true);

            let locationData = undefined;

            if (location) {
                locationData = {
                    coordinates: [location.coords.longitude, location.coords.latitude],
                    address: address
                };
            } else if (manualAddress) {
                // Geocode manual address
                const geocoded = await Location.geocodeAsync(manualAddress);
                if (geocoded && geocoded.length > 0) {
                    locationData = {
                        coordinates: [geocoded[0].longitude, geocoded[0].latitude],
                        address: manualAddress
                    };
                }
            }

            const donationData = {
                type,
                amount: type === 'money' ? parseFloat(amount) : 0,
                itemDescription: type === 'supplies' ? itemDescription : undefined,
                location: locationData
            };

            const response = await createDonation(donationData);

            if (response.success) {
                Alert.alert(
                    'Thank You!',
                    type === 'money'
                        ? 'Your donation has been processed successfully.'
                        : 'Your pledge has been recorded. We will contact you for collection.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        } catch (error) {
            console.error('Donation error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to process donation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
                {loading && <AppLoader visible={true} overlay />}

                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                    Make a Donation
                </Text>

                <Text variant="bodyMedium" style={styles.subtitle}>
                    Your support helps us provide critical relief to those in need.
                </Text>

                <View style={styles.formContainer}>
                    <Text variant="titleMedium" style={styles.label}>Donation Type</Text>
                    <SegmentedButtons
                        value={type}
                        onValueChange={setType}
                        buttons={[
                            { value: 'money', label: 'Monetary', icon: 'cash' },
                            { value: 'supplies', label: 'Supplies', icon: 'package-variant' },
                        ]}
                        style={styles.segmentedButtons}
                    />

                    {type === 'money' ? (
                        <>
                            <Text variant="titleMedium" style={styles.label}>Amount (USD)</Text>
                            <TextInput
                                mode="outlined"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="Enter amount"
                                left={<TextInput.Affix text="$" />}
                                style={styles.input}
                            />
                        </>
                    ) : (
                        <>
                            <Text variant="titleMedium" style={styles.label}>Description of Supplies</Text>
                            <TextInput
                                mode="outlined"
                                value={itemDescription}
                                onChangeText={setItemDescription}
                                placeholder="e.g., Blankets, Canned Food, Clothes"
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                            />
                        </>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                        contentStyle={{ height: 50 }}
                    >
                        {type === 'money' ? 'Donate Now' : 'Pledge Supplies'}
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.7,
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        elevation: 2,
    },
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    segmentedButtons: {
        marginBottom: 24,
    },
    permissionContainer: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 24,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
    },
});

export default DonateScreen;
