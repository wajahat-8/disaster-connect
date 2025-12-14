import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, useTheme, RadioButton } from 'react-native-paper';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import apiClient from '../../api/apiClient';

const AdminNotificationScreen = ({ navigation }) => {
    const theme = useTheme();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState('all');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert('Error', 'Please enter both title and message');
            return;
        }

        setLoading(true);
        try {
            // payload matches backend sendNotification controller
            // userRoles is used for role-based targeting
            // topic is used for 'all' (if topic 'all' exists) or we can use empty filters for broad broadcast if backend supports it
            // proper backend logic:
            // if targetAudience === 'all', we might need a specific logic or send to all roles if backend doesn't support 'all' keyword directly in /send
            // Looking at backend: /send takes { userIds, userRoles, topic }
            // If I want to send to everyone, I might need to send to roles ['user', 'volunteer', 'admin'] or use a topic if subscribed.
            // Let's assume sending to roles for now as it's safer.

            let payload = {
                title,
                body: message,
            };

            if (targetAudience === 'all') {
                payload.userRoles = ['user', 'volunteer', 'admin'];
            } else {
                payload.userRoles = [targetAudience];
            }

            const response = await apiClient.post('/notifications/send', payload);

            if (response.data.success) {
                Alert.alert('Success', 'Notification sent successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <AppCard>
                <Text variant="titleLarge" style={styles.header}>Send Notification</Text>

                <Text variant="labelLarge" style={styles.label}>Target Audience</Text>
                <RadioButton.Group onValueChange={value => setTargetAudience(value)} value={targetAudience}>
                    <View style={styles.radioRow}>
                        <RadioButton.Item label="All Users" value="all" />
                        <RadioButton.Item label="Volunteers" value="volunteer" />
                        <RadioButton.Item label="Regular Users" value="user" />
                    </View>
                </RadioButton.Group>

                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Message"
                    value={message}
                    onChangeText={setMessage}
                    style={[styles.input, styles.textArea]}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                />

                <AppButton
                    text="Send Notification"
                    onPress={handleSend}
                    loading={loading}
                    disabled={loading}
                    icon="send"
                    mode="contained"
                    style={styles.button}
                />
            </AppCard>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
    },
    header: {
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        marginBottom: 15,
    },
    textArea: {
        minHeight: 100,
    },
    button: {
        marginTop: 10,
    },
    radioRow: {
        marginBottom: 15,
    }
});

export default AdminNotificationScreen;
