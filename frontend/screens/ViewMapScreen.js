import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Text, useTheme, IconButton, Chip } from 'react-native-paper';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/apiClient';

export default function ViewMapScreen({ navigation }) {
  const theme = useTheme();
  const [region, setRegion] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({ latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
      fetchDisasters(latitude, longitude);
    } catch (error) {
      console.error('Location error:', error);
      // Default to San Francisco
      const defaultLat = 37.78825;
      const defaultLng = -122.4324;
      setRegion({ latitude: defaultLat, longitude: defaultLng, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
      fetchDisasters(defaultLat, defaultLng);
    }
  };

  const fetchDisasters = async (lat, lng) => {
    try {
      const response = await api.get('/disasters/nearby', { params: { lat, lng, radius: 50 } });
      if (response.data.success) {
        setDisasters(response.data.disasters);
      }
    } catch (error) {
      console.error('Fetch disasters error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'high': return '#FFA500'; // Orange
      case 'medium': return '#FFFF00'; // Yellow
      case 'low': return '#00FF00'; // Green
      default: return 'gray';
    }
  };

  const onMarkerPress = (disaster) => {
    // If we want to show the modal immediately on press, we can do it here.
    // Or we can let the user click the Callout.
    // Let's supporting clicking the Callout to view full details.
    setSelectedDisaster(disaster);
  };

  const onCalloutPress = () => {
    setModalVisible(true);
  };

  if (loading || !region) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={setRegion}
      >
        {disasters.map((disaster, index) => (
          <Marker
            key={disaster._id || index}
            coordinate={{
              latitude: disaster.location.coordinates[1],
              longitude: disaster.location.coordinates[0],
            }}
            pinColor={getMarkerColor(disaster.severity)}
            onPress={() => onMarkerPress(disaster)}
          >
            <Callout onPress={onCalloutPress} style={styles.callout}>
              <View style={styles.calloutContainer}>
                <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{disaster.type.toUpperCase()}</Text>
                <Text variant="bodySmall" style={{ color: getMarkerColor(disaster.severity) }}>Severity: {disaster.severity}</Text>
                <Text style={{ color: theme.colors.primary, marginTop: 4, fontSize: 12 }}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            {selectedDisaster && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="alert" size={24} color={getMarkerColor(selectedDisaster.severity)} />
                    <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold', marginLeft: 10 }}>
                      {selectedDisaster.type.toUpperCase()}
                    </Text>
                  </View>
                  <IconButton icon="close" onPress={() => setModalVisible(false)} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <Chip icon="alert-circle-outline" style={{ backgroundColor: getMarkerColor(selectedDisaster.severity) + '40' }}>
                    Severity: {selectedDisaster.severity}
                  </Chip>
                  {selectedDisaster.verified && (
                    <Chip icon="check-decagram" style={{ marginLeft: 10, backgroundColor: '#E8F5E9' }} textStyle={{ color: 'green' }}>
                      Verified
                    </Chip>
                  )}
                </View>

                <Text variant="bodyLarge" style={{ marginBottom: 15 }}>
                  {selectedDisaster.description}
                </Text>

                {selectedDisaster.location.address && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                      {selectedDisaster.location.address}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="gray" />
                  <Text variant="bodySmall" style={{ marginLeft: 8, color: theme.colors.outline }}>
                    Reported: {new Date(selectedDisaster.createdAt).toLocaleString()}
                  </Text>
                </View>

              </ScrollView>
            )}

            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  closeButton: { marginTop: 20 },
  callout: { minWidth: 150 },
  calloutContainer: { padding: 5, alignItems: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 }
});