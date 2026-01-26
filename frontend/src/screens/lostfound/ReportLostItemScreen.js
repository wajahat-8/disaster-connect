import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, useTheme, Surface, HelperText } from 'react-native-paper';
import AppInput from '../../components/common/AppInput';
import { reportLost } from '../../api/lostFoundApi';
import { LocationPicker, ImageUploader } from '../main/components';

export default function ReportLostItemScreen({ navigation }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    // Form State
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    const handleSubmit = async () => {
        // Validate required fields
        const trimmedItemName = itemName?.trim();
        const trimmedDescription = description?.trim();
        
        if (!trimmedItemName || !trimmedDescription || !location) {
            Alert.alert('Missing Fields', 'Please fill in Item Name, Description, and Location.');
            return;
        }

        // Validate location has coordinates
        if (!location.longitude || !location.latitude) {
            Alert.alert('Invalid Location', 'Please select a valid location.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('itemName', trimmedItemName);
            formData.append('description', trimmedDescription);

            // Location
            formData.append('location[type]', 'Point');
            formData.append('location[coordinates][0]', location.longitude.toString());
            formData.append('location[coordinates][1]', location.latitude.toString());
            if (address) formData.append('location[address]', address);

            // Contact
            if (contactPhone?.trim()) formData.append('contactInfo[phone]', contactPhone.trim());
            if (contactEmail?.trim()) formData.append('contactInfo[email]', contactEmail.trim());

            // Image
            if (image) {
                const filename = image.split('/').pop();
                // Handle more image extensions
                const match = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.exec(filename);
                const ext = match ? match[1].toLowerCase() : 'jpeg';
                // Normalize extension for MIME type
                const mimeType = ext === 'jpg' ? 'jpeg' : ext;
                formData.append('image', {
                    uri: image,
                    name: filename,
                    type: `image/${mimeType}`,
                });
            }

            const res = await reportLost(formData);
            if (res.data && res.data.success) {
                Alert.alert('Success', 'Lost item reported successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', res.data?.message || 'Failed to report lost item.');
            }
        } catch (error) {
            console.error('Report lost item error:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Failed to report lost item.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
                        Report Lost Item
                    </Text>
                    <Text variant="bodyMedium" style={{ color: 'gray' }}>
                        Help others find your item by providing details.
                    </Text>
                </View>

                <Surface style={styles.section} elevation={1}>
                    <AppInput
                        label="Item Name"
                        value={itemName}
                        onChangeText={setItemName}
                        placeholder="e.g., Black Wallet, Golden Retriever"
                    />
                    <AppInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        placeholder="Provide distinguishing features..."
                    />
                </Surface>

                <View style={styles.sectionTitle}>
                    <Text variant="titleMedium">Last Seen Location</Text>
                </View>
                <LocationPicker
                    coordinates={location}
                    address={address}
                    onLocationChange={({ coordinates, address }) => {
                        setLocation(coordinates);
                        setAddress(address);
                    }}
                />

                <View style={styles.sectionTitle}>
                    <Text variant="titleMedium">Photo</Text>
                </View>
                <ImageUploader imageUri={image} onImageChange={setImage} />
                <HelperText type="info">Uploading a photo significantly increases chances of recovery.</HelperText>

                <View style={styles.sectionTitle}>
                    <Text variant="titleMedium">Contact Info (Optional)</Text>
                </View>
                <Surface style={styles.section} elevation={1}>
                    <AppInput
                        label="Phone"
                        value={contactPhone}
                        onChangeText={setContactPhone}
                        keyboardType="phone-pad"
                        leftIcon="phone"
                    />
                    <AppInput
                        label="Email"
                        value={contactEmail}
                        onChangeText={setContactEmail}
                        keyboardType="email-address"
                        leftIcon="email"
                        autoCapitalize="none"
                    />
                </Surface>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                    buttonColor={theme.colors.error}
                    contentStyle={{ height: 50 }}
                >
                    Report Lost Item
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
    },
    section: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 8,
        marginLeft: 4,
    },
    submitButton: {
        marginTop: 20,
        borderRadius: 8,
    }
});
