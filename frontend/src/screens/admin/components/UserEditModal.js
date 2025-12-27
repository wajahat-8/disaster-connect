import React from 'react';
import { View, Text, Modal, ScrollView, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import AppButton from '../../../components/common/AppButton';
import AppInput from '../../../components/common/AppInput';

const ROLES = ['user', 'volunteer', 'admin'];

const UserEditModal = ({
    visible,
    onClose,
    editForm,
    onFormChange,
    onSave
}) => {
    const theme = useTheme();
    const handleFieldChange = (field, value) => {
        onFormChange({ ...editForm, [field]: value });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Edit User</Text>

                    <ScrollView style={styles.modalForm}>
                        <AppInput
                            label="Name"
                            value={editForm.name}
                            onChangeText={(text) => handleFieldChange('name', text)}
                        />

                        <Text style={[styles.label, { color: theme.colors.textPrimary }]}>Role</Text>
                        <View style={styles.roleOptions}>
                            {ROLES.map((role) => (
                                <Chip
                                    key={role}
                                    selected={editForm.role === role}
                                    onPress={() => handleFieldChange('role', role)}
                                    style={{ marginRight: 5, flex: 1 }}
                                    showSelectedOverlay
                                >
                                    {role.toUpperCase()}
                                </Chip>
                            ))}
                        </View>

                        <AppInput
                            label="Skills (comma separated)"
                            value={editForm.skills}
                            onChangeText={(text) => handleFieldChange('skills', text)}
                        />

                        <AppInput
                            label="Location"
                            value={editForm.location}
                            onChangeText={(text) => handleFieldChange('location', text)}
                        />

                        <AppInput
                            label="Phone"
                            value={editForm.phone}
                            onChangeText={(text) => handleFieldChange('phone', text)}
                        />
                    </ScrollView>

                    <View style={styles.modalActions}>
                        <AppButton
                            mode="outlined"
                            text="Cancel"
                            onPress={onClose}
                            style={{ flex: 1, marginRight: 10 }}
                        />

                        <AppButton
                            mode="contained"
                            text="Save Changes"
                            onPress={onSave}
                            style={{ flex: 1, marginLeft: 10 }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        // backgroundColor: '#fff', overridden
        borderRadius: 10,
        padding: 20,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        // color: '#2c3e50', overridden
    },
    modalForm: {
        maxHeight: 400,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        // color: '#2c3e50', overridden
    },
    roleOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default UserEditModal;
