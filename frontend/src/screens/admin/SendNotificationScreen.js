import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { TextInput, RadioButton, useTheme } from 'react-native-paper';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../auth';

const SendNotificationScreen = ({ navigation }) => {
    const { isAdmin } = useAuth();
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
                    {
                        text: 'OK',
                        onPress: () => {
                            setTitle('');
                            setMessage('');
                            setTargetAudience('all');
                        },
                    },
                ]);
            }
        } catch (error) {
            console.error('Send notification error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied. Admin privileges required.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Send Notification</Text>

            <AppCard style={styles.card}>
                <Text style={[styles.label, { color: theme.colors.primary }]}>Target Audience</Text>
                <RadioButton.Group onValueChange={setTargetAudience} value={targetAudience}>
                    <View style={styles.radioContainer}>
                        <RadioButton.Item label="All Users" value="all" />
                        <RadioButton.Item label="Volunteers Only" value="volunteer" />
                        <RadioButton.Item label="Regular Users Only" value="user" />
                    </View>
                </RadioButton.Group>

                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    mode="outlined"
                    placeholder="Enter notification title"
                />

                <TextInput
                    label="Message"
                    value={message}
                    onChangeText={setMessage}
                    style={[styles.input, styles.textArea]}
                    mode="outlined"
                    multiline
                    numberOfLines={5}
                    placeholder="Enter notification message"
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
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f6fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2c3e50',
    },
    card: {
        padding: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#2c3e50',
    },
    radioContainer: {
        marginBottom: 15,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    textArea: {
        minHeight: 120,
    },
    button: {
        marginTop: 10,
    },
    errorText: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 18,
        marginTop: 50,
    },
});

export default SendNotificationScreen;
