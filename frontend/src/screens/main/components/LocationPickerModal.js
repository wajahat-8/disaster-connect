import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppButton from '../../../components/common/AppButton';

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
  const [selectedLoc, setSelectedLoc] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const [region, setRegion] = useState({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (visible) {
      setSelectedLoc({ latitude: initialLat, longitude: initialLng });
      setRegion(prev => ({ ...prev, latitude: initialLat, longitude: initialLng }));
    }
  }, [visible, initialLat, initialLng]);

  const handleMapPress = (e) => {
    setSelectedLoc(e.nativeEvent.coordinate);
  };

  const confirmLocation = () => {
    onLocationSelected(selectedLoc.latitude, selectedLoc.longitude);
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
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          moveOnMarkerPress={false} // Prevent glitchy movement
        >
          <Marker
            coordinate={selectedLoc}
            draggable
            onDragEnd={handleMapPress}
            title="Selected Location"
            description="Long press and drag to adjust"
          />
        </MapView>

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
