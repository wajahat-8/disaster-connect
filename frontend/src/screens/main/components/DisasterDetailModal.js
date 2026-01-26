import React from 'react';
import { View, Modal, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, useTheme, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppButton from '../../../components/common/AppButton';
import { getImageUrl } from '../../../utils/imageUtils';

/**
 * Get color based on disaster severity.
 */
const getMarkerColor = (severity, theme) => {
    switch (severity) {
        case 'critical': return theme.colors.error;
        case 'high': return '#FFA500';
        case 'medium': return '#FFFF00';
        case 'low': return '#00FF00';
        default: return 'gray';
    }
};

/**
 * Modal showing full disaster details.
 * @param {Object} props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Object|null} props.disaster - Selected disaster object or null
 * @param {Function} props.onClose - Callback to close modal
 */
const DisasterDetailModal = ({ visible, disaster, onClose }) => {
    const theme = useTheme();

    if (!disaster) return null;

    const markerColor = getMarkerColor(disaster.severity, theme);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <ScrollView>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.headerTitle}>
                                <MaterialCommunityIcons name="alert" size={24} color={markerColor} />
                                <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                                    {disaster.type.toUpperCase()}
                                </Text>
                            </View>
                            <IconButton icon="close" onPress={onClose} />
                        </View>

                        {/* Severity and Verified Chips */}
                        <View style={styles.chipsRow}>
                            <Chip
                                icon="alert-circle-outline"
                                style={{ backgroundColor: markerColor + '40' }}
                            >
                                {`Severity: ${disaster.severity}`}
                            </Chip>
                            {disaster.verified && (
                                <Chip
                                    icon="check-decagram"
                                    style={styles.verifiedChip}
                                    textStyle={{ color: 'green' }}
                                >
                                    Verified
                                </Chip>
                            )}
                        </View>

                        {/* Description */}
                        <Text variant="bodyLarge" style={styles.description}>
                            {disaster.description}
                        </Text>

                        {/* Image */}
                        {(() => {
                            // Check if disaster has an image - handle various edge cases
                            const imageValue = disaster.image;
                            
                            // Check if image exists and is valid
                            const hasImage = imageValue && 
                                           typeof imageValue === 'string' &&
                                           imageValue.trim() !== '' && 
                                           imageValue !== 'no-photo.jpg' &&
                                           imageValue !== 'null' &&
                                           imageValue !== 'undefined' &&
                                           imageValue.toLowerCase() !== 'none';
                            
                            if (!hasImage) {
                                if (__DEV__) {
                                    console.log('DisasterDetailModal: No image to display. Image value:', imageValue, 'Type:', typeof imageValue);
                                }
                                return null;
                            }
                            
                            const imageUrl = getImageUrl(imageValue);
                            
                            if (!imageUrl) {
                                if (__DEV__) {
                                    console.warn('DisasterDetailModal: getImageUrl returned null for:', imageValue);
                                }
                                return null;
                            }
                            
                            if (__DEV__) {
                                console.log('DisasterDetailModal: Displaying image from URL:', imageUrl, 'Original path:', imageValue);
                            }
                            
                            return (
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={styles.disasterImage}
                                        resizeMode="cover"
                                        onError={(error) => {
                                            console.error('Disaster image load error:', error.nativeEvent?.error || error, 'for URL:', imageUrl);
                                        }}
                                        onLoad={() => {
                                            if (__DEV__) {
                                                console.log('Disaster image loaded successfully:', imageUrl);
                                            }
                                        }}
                                    />
                                </View>
                            );
                        })()}

                        {/* Address */}
                        {disaster.location.address && (
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.primary} />
                                <Text variant="bodyMedium" style={styles.infoText}>
                                    {disaster.location.address}
                                </Text>
                            </View>
                        )}

                        {/* Time */}
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color="gray" />
                            <Text variant="bodySmall" style={{ marginLeft: 8, color: theme.colors.outline }}>
                                Reported: {new Date(disaster.createdAt).toLocaleString()}
                            </Text>
                        </View>
                    </ScrollView>

                    <AppButton mode="contained" text="Close" onPress={onClose} style={styles.closeButton} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginLeft: 10,
    },
    chipsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    verifiedChip: {
        marginLeft: 10,
        backgroundColor: '#E8F5E9',
    },
    description: {
        marginBottom: 15,
    },
    imageContainer: {
        width: '100%',
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    disasterImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    infoText: {
        marginLeft: 8,
        flex: 1,
    },
    closeButton: {
        marginTop: 20,
    },
});

export default DisasterDetailModal;
