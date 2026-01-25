import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, useTheme, Text } from 'react-native-paper';

export default function AppCard({
    children,
    onPress,
    style,
    title,
    subtitle,
    left,
    right,
    contentStyle,
    mode = 'elevated',
    ...props
}) {
    const theme = useTheme();

    return (
        <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }, style]}
            onPress={onPress}
            mode={mode}
            {...props}
        >
            {(title || subtitle) ? (
                <Card.Title
                    title={title}
                    subtitle={subtitle}
                    left={left}
                    right={right}
                    titleStyle={styles.title}
                />
            ) : null}
            <Card.Content style={contentStyle}>
                {children}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 12,
    },
    title: {
        fontWeight: 'bold',
    },
});
