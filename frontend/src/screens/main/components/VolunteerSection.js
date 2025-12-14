import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, HelperText } from 'react-native-paper';
import AppInput from '../../../components/common/AppInput';
import AppButton from '../../../components/common/AppButton';

/**
 * Volunteer section component for EditProfileScreen.
 * Shows sign-up option for users or skills input for volunteers.
 * 
 * @param {Object} props
 * @param {string} props.currentRole - Current role ('user', 'volunteer', 'admin')
 * @param {string} props.skills - Comma-separated skills string
 * @param {string} props.skillsError - Error message for skills validation
 * @param {Function} props.onSkillsChange - Callback when skills change
 * @param {Function} props.onBecomeVolunteer - Callback when user wants to become volunteer
 * @param {Function} props.onStopVolunteering - Callback when volunteer wants to revert to user
 */
const VolunteerSection = ({
    currentRole,
    skills,
    skillsError,
    onSkillsChange,
    onBecomeVolunteer,
    onStopVolunteering
}) => {
    const theme = useTheme();

    // Show sign-up option for regular users
    if (currentRole === 'user') {
        return (
            <View style={[styles.volunteerSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                <Text variant="titleMedium" style={styles.title}>Become a Volunteer</Text>
                <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                    As a volunteer, you can help others during disasters and emergencies.
                </Text>
                <AppButton mode="contained" text="Sign Up as Volunteer" onPress={onBecomeVolunteer} />
            </View>
        );
    }

    // Show skills input and revert option for volunteers
    if (currentRole === 'volunteer') {
        return (
            <View style={styles.section}>
                <Text variant="labelLarge" style={[styles.volunteerLabel, { color: theme.colors.primary }]}>
                    🎗️ You are a Volunteer
                </Text>
                <AppInput
                    label="Skills (comma separated)"
                    value={skills}
                    onChangeText={onSkillsChange}
                    multiline
                    error={skillsError}
                />
                <HelperText type="info">Example: First Aid, Driving, Cooking</HelperText>

                <AppButton
                    mode="outlined"
                    text="Stop Volunteering (Revert to User)"
                    style={[styles.stopButton, { borderColor: theme.colors.error }]}
                    labelStyle={{ color: theme.colors.error }}
                    onPress={onStopVolunteering}
                />
            </View>
        );
    }

    // Admins don't see volunteer options
    return null;
};

const styles = StyleSheet.create({
    volunteerSection: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 15,
        marginVertical: 15,
    },
    title: {
        marginBottom: 5,
    },
    description: {
        marginBottom: 15,
    },
    section: {
        marginBottom: 10,
    },
    volunteerLabel: {
        marginBottom: 5,
    },
    stopButton: {
        marginTop: 10,
    },
});

export default VolunteerSection;
