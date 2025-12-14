import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, IconButton, Surface } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AppCard from '../../../components/common/AppCard';
import AppButton from '../../../components/common/AppButton';

/**
 * Image uploader component with camera and gallery options.
 * @param {Object} props
 * @param {string|null} props.imageUri - Current image URI or null
 * @param {Function} props.onImageChange - Callback when image changes (uri or null)
 */
const ImageUploader = ({ imageUri, onImageChange }) => {
    const theme = useTheme();

    const processImageResult = (result) => {
        if (!result.canceled) {
            onImageChange(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
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
                allowsEditing: true,
                quality: 0.8,
            });
            processImageResult(result);
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const showEditOptions = () => {
        Alert.alert('Edit Image', 'Choose an option to crop/edit', [
            { text: 'Gallery', onPress: pickImage },
            { text: 'Camera', onPress: takePhoto },
            { text: 'Cancel', style: 'cancel' }
        ]);
    };

    return (
        <AppCard>
            <Text variant="titleMedium" style={[styles.label, { color: theme.colors.primary }]}>
                Photo Evidence
            </Text>

            {imageUri ? (
                <Surface style={styles.imagePreviewContainer} elevation={0}>
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    <View style={styles.imageActions}>
                        <AppButton
                            mode="contained-tonal"
                            text="Edit / Crop"
                            icon="crop"
                            onPress={showEditOptions}
                            style={{ flex: 1, marginRight: 5 }}
                        />
                        <AppButton
                            mode="contained"
                            text="Remove"
                            buttonColor={theme.colors.error}
                            icon="delete"
                            onPress={() => onImageChange(null)}
                            style={{ flex: 1, marginLeft: 5 }}
                        />
                    </View>
                </Surface>
            ) : (
                <TouchableOpacity style={styles.uploadPlaceholder} onPress={() => { }}>
                    <IconButton icon="cloud-upload" size={40} iconColor={theme.colors.primary} />
                    <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
                        Tap below to upload photo
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 15 }}>
                        You can crop the image after selecting
                    </Text>

                    <View style={styles.uploadButtonsRow}>
                        <AppButton mode="outlined" text="Gallery" icon="image" onPress={pickImage} style={styles.uploadBtn} />
                        <AppButton mode="contained" text="Camera" icon="camera" onPress={takePhoto} style={styles.uploadBtn} />
                    </View>
                </TouchableOpacity>
            )}
        </AppCard>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
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
});

export default ImageUploader;
