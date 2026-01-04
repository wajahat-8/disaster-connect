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
        if (!itemName || !description || !location) {
            Alert.alert('Missing Fields', 'Please fill in Item Name, Description, and Location.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('itemName', itemName);
            formData.append('description', description);

            // Location
            formData.append('location[type]', 'Point');
            formData.append('location[coordinates][0]', location.longitude.toString());
            formData.append('location[coordinates][1]', location.latitude.toString());
            if (address) formData.append('location[address]', address);

            // Contact
            if (contactPhone) formData.append('contactInfo[phone]', contactPhone);
            if (contactEmail) formData.append('contactInfo[email]', contactEmail);

            // Image
            if (image) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
                formData.append('image', {
                    uri: image,
                    name: filename,
                    type,
                });
            }

            const res = await reportLost(formData);
            if (res.data.success) {
                Alert.alert('Success', 'Lost item reported successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to report lost item.');
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
