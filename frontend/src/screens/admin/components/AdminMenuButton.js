import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const AdminMenuButton = ({ title, subtitle, icon, onPress, color }) => {
    const theme = useTheme();
    const buttonColor = color || theme.colors.primary; // Default to theme primary if no color passed
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={styles.card}>
                <View style={styles.content}>
                    <View style={[styles.iconContainer, { backgroundColor: buttonColor + '20' }]}>
                        <Ionicons name={icon} size={28} color={buttonColor} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={theme.colors.textTertiary} />
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        // color: '#2c3e50', overridden
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        // color: '#7f8c8d', overridden
    },
});

export default AdminMenuButton;
