import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import MapView from 'react-native-maps';
import AppButton from '../../../components/common/AppButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Modal component for picking a location using native maps.
 * Allows user to tap map or drag marker to select coordinate.
 */
const LocationPickerModal = ({
  visible,
  onClose,
  onLocationSelected,
  initialLat = 37.78825,
  initialLng = -122.4324
}) => {
  const [region, setRegion] = useState({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (visible) {
      setRegion(prev => ({ ...prev, latitude: initialLat, longitude: initialLng }));
    }
  }, [visible, initialLat, initialLng]);

  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  const confirmLocation = () => {
    // The selected location is the center of the map (region)
    onLocationSelected(region.latitude, region.longitude);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          loadingIndicatorColor="#00695C"
          loadingBackgroundColor="#ffffff"
        />

        {/* Fixed Center Marker */}
        <View style={styles.markerFixed}>
          <MaterialCommunityIcons name="map-marker" size={48} color="#D93025" />
        </View>

        {/* Hint Text */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>Move map to align marker</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            mode="contained"
            text="Confirm Location"
            onPress={confirmLocation}
            style={styles.confirmButton}
          />
          <AppButton
            mode="outlined"
            text="Cancel"
            onPress={onClose}
            style={styles.cancelButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerFixed: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -24, // Half of size
    marginTop: -48, // Full size (bottom of pin at center)
    elevation: 4,
    zIndex: 10,
    pointerEvents: 'none', // Allow touches to pass through to map
  },
  hintContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  hintText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },
  confirmButton: {
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'white',
  },
});

export default LocationPickerModal;
