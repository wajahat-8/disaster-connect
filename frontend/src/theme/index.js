import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00695C', // Deep Teal - Professional & Trustworthy
        onPrimary: '#FFFFFF',
        primaryContainer: '#4DB6AC',
        onPrimaryContainer: '#00251A',
        secondary: '#D32F2F', // Alert Red - for emergencies
        onSecondary: '#FFFFFF',
        secondaryContainer: '#FFCDD2',
        onSecondaryContainer: '#4A0000',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        error: '#B00020',
        success: '#27ae60',
        warning: '#f39c12',

        // Text Colors
        textPrimary: '#2c3e50',
        textSecondary: '#7f8c8d',
        textTertiary: '#95a5a6',

        // Severity Colors
        severity: {
            low: '#27ae60',
            medium: '#f39c12',
            high: '#e67e22',
            critical: '#e74c3c',
        },

        // Role Colors
        role: {
            admin: '#e74c3c',
            volunteer: '#f39c12',
            user: '#b0bec5', // Blue Grey - More distinct than previous gray
        },

        // Custom UI Colors
        cardBorder: '#e0e0e0',
        lightBackground: '#f5f5f5',
        nearestShelter: '#10b981',
        nearestShelterBg: '#ecfdf5',
    },
    // We can customize fonts here if needed
};
