import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../../../components/common/AppButton';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <View style={styles.pagination}>
            <AppButton
                mode="outlined"
                text="Previous"
                onPress={handlePrevious}
                disabled={currentPage === 1}
            />

            <Text style={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
            </Text>

            <AppButton
                mode="outlined"
                text="Next"
                onPress={handleNext}
                disabled={currentPage === totalPages}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    paginationInfo: {
        color: '#7f8c8d',
        fontWeight: 'bold',
    },
});

export default Pagination;
