import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import AppInput from '../../../components/common/AppInput';

const ROLES = ['all', 'user', 'volunteer', 'admin'];

const UserFilters = ({ filters, onFiltersChange }) => {
    const handleSearchChange = (text) => {
        onFiltersChange({ ...filters, search: text, page: 1 });
    };

    const handleRoleChange = (role) => {
        onFiltersChange({ ...filters, role, page: 1 });
    };

    return (
        <View style={styles.filtersContainer}>
            <AppInput
                placeholder="Search by name or email..."
                value={filters.search}
                onChangeText={handleSearchChange}
                leftIcon="magnify"
            />

            <View style={styles.roleFilters}>
                {ROLES.map((role) => (
                    <Chip
                        key={role}
                        selected={filters.role === role}
                        onPress={() => handleRoleChange(role)}
                        style={{ marginRight: 5, flex: 1 }}
                        showSelectedOverlay
                    >
                        {role.toUpperCase()}
                    </Chip>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        marginBottom: 20,
    },
    roleFilters: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default UserFilters;
