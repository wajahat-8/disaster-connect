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
    },
    // We can customize fonts here if needed
};
