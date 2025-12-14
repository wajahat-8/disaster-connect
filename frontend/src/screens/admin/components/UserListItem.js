import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Chip } from 'react-native-paper';
import AppCard from '../../../components/common/AppCard';
import AppButton from '../../../components/common/AppButton';

const UserListItem = ({ user, onEdit, onDelete }) => {
    const theme = useTheme();

    return (
        <AppCard style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                    <Chip
                        style={[styles.roleBadge, styles[`role${user.role}`]]}
                        textStyle={{
                            color: user.role === 'volunteer' || user.role === 'admin' ? 'white' : 'black',
                            fontSize: 10,
                            lineHeight: 10,
                            marginVertical: 0,
                            marginHorizontal: 4
                        }}
                        height={24}
                    >
                        {user.role.toUpperCase()}
                    </Chip>
                    <Text style={styles.date}>
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                {user.skills && user.skills.length > 0 && (
                    <Text style={styles.skills}>Skills: {user.skills.join(', ')}</Text>
                )}
            </View>

            <View style={styles.userActions}>
                <AppButton
                    mode="contained"
                    text="Edit"
                    onPress={() => onEdit(user)}
                    style={{ marginRight: 5 }}
                    contentStyle={{ height: 36 }}
                    labelStyle={{ fontSize: 12 }}
                />

                {user.role !== 'admin' && (
                    <AppButton
                        mode="contained"
                        text="Delete"
                        buttonColor={theme.colors.error}
                        onPress={() => onDelete(user)}
                        contentStyle={{ height: 36 }}
                        labelStyle={{ fontSize: 12 }}
                    />
                )}
            </View>
        </AppCard>
    );
};

const styles = StyleSheet.create({
    userCard: {
        marginBottom: 10,
    },
    userInfo: {
        flex: 1,
        paddingHorizontal: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    userEmail: {
        fontSize: 14,
        color: '#7f8c8d',
        marginVertical: 2,
    },
    userMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    roleBadge: {
        marginRight: 10,
    },
    roleuser: {
        backgroundColor: '#d5dbdb',
    },
    rolevolunteer: {
        backgroundColor: '#f39c12',
    },
    roleadmin: {
        backgroundColor: '#e74c3c',
    },
    date: {
        fontSize: 12,
        color: '#95a5a6',
        marginLeft: 5,
    },
    skills: {
        fontSize: 12,
        color: '#34495e',
        marginTop: 5,
        fontStyle: 'italic',
    },
    userActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
});

export default UserListItem;
