import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Contact information section for shelter details.
 * @param {Object} props
 * @param {Object} props.contactInfo - Contact info object with phone and email
 */
const ContactInfo = ({ contactInfo }) => {
    const theme = useTheme();

    if (!contactInfo?.phone && !contactInfo?.email) {
        return null;
    }

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="map-marker-radius" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.sectionTitle}>Contact & Location</Text>
            </View>

            {contactInfo?.phone && (
                <View style={styles.contactRow}>
                    <Avatar.Icon size={36} icon="phone" style={styles.phoneIcon} color={theme.colors.primary} />
                    <View style={styles.contactText}>
                        <Text variant="bodySmall" style={styles.label}>Phone</Text>
                        <Text
                            variant="bodyLarge"
                            onPress={() => Linking.openURL(`tel:${contactInfo.phone}`)}
                            style={[styles.value, { color: theme.colors.primary }]}
                        >
                            {contactInfo.phone}
                        </Text>
                    </View>
                </View>
            )}

            {contactInfo?.email && (
                <View style={styles.contactRow}>
                    <Avatar.Icon size={36} icon="email" style={styles.emailIcon} color="#1976d2" />
                    <View style={styles.contactText}>
                        <Text variant="bodySmall" style={styles.label}>Email</Text>
                        <Text variant="bodyLarge">{contactInfo.email}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    contactRow: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    phoneIcon: {
        backgroundColor: '#e0f2f1',
    },
    emailIcon: {
        backgroundColor: '#e3f2fd',
    },
    contactText: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    label: {
        color: 'gray',
    },
    value: {
        fontWeight: 'bold',
    },
});

export default ContactInfo;
