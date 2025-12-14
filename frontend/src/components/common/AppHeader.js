import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function AppHeader({
    title,
    subtitle,
    showBack = false,
    onBack,
    rightAction,
    rightIcon,
    onRightPress,
    style,
}) {
    const theme = useTheme();
    const navigation = useNavigation();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }, style]} elevated>
            {showBack ? (
                <Appbar.BackAction onPress={handleBack} />
            ) : null}

            <Appbar.Content
                title={title}
                subtitle={subtitle}
                titleStyle={styles.title}
            />

            {rightAction ? (
                rightAction
            ) : (
                rightIcon && <Appbar.Action icon={rightIcon} onPress={onRightPress} color={theme.colors.primary} />
            )}
        </Appbar.Header>
    );
}

const styles = {
    header: {
        // Custom header styles if needed
    },
    title: {
        fontWeight: 'bold',
    },
};
