import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme, FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import apiClient from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import LocationPermissionPrompt from '../../components/common/LocationPermissionPrompt';
import { DisasterMarker, DisasterDetailModal } from './components';

/**
 * Screen showing a map with nearby disaster markers.
 * Uses react-native-maps with OpenStreetMap tiles for Expo Go.
 */
export default function ViewMapScreen({ navigation }) {
  const theme = useTheme();
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const regionRef = useRef(null);

  useEffect(() => {
    initializeMap();
  }, []);

  // ============ Initialization ============

  const initializeMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermissionDenied(true);
        setLoading(false);
        return;
      }

      setLocationPermissionDenied(false);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      setRegion(newRegion);
      regionRef.current = newRegion;
      fetchDisasters(latitude, longitude);
    } catch (error) {
      console.error('[ViewMapScreen] Location error:', error);
      setLocationPermissionDenied(true);
      setLoading(false);
    }
  };

  const fetchDisasters = async (lat, lng) => {
    try {
      const response = await apiClient.get('/disasters/nearby', { params: { lat, lng, radius: 10000 } });
      if (response.data.success) {
        setDisasters(response.data.disasters);
      }
    } catch (error) {
      console.error('[ViewMapScreen] Fetch disasters error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch disasters when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (regionRef.current) {
        const { latitude, longitude } = regionRef.current;
        fetchDisasters(latitude, longitude);
      }
    }, [])
  );

  // ============ Handlers ============

  const onMarkerPress = (disaster) => {
    setSelectedDisaster(disaster);
    setModalVisible(true);
  };

  const centerOnUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      setRegion(newRegion);
      regionRef.current = newRegion;
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location');
    }
  };

  // ============ Render ============

  // Show location permission prompt if denied
  if (locationPermissionDenied) {
    return <LocationPermissionPrompt />;
  }

  if (loading || !region) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <AppLoader visible={true} message="Loading map..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={Platform.OS === 'ios'}
        onMapReady={() => {
        }}
        onRegionChangeComplete={(newRegion) => {
          regionRef.current = newRegion;
        }}
      >
        {disasters.map((disaster, index) => {
          if (!disaster.location || !disaster.location.coordinates) {
            console.warn('[ViewMapScreen] Disaster missing location:', disaster);
            return null;
          }

          const [lng, lat] = disaster.location.coordinates;

          return (
            <DisasterMarker
              key={disaster._id || index}
              disaster={disaster}
              onPress={onMarkerPress}
            />
          );
        })}
      </MapView>

      {/* Floating action button to center on user location */}
      <FAB
        icon="crosshairs-gps"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={centerOnUserLocation}
        color="#ffffff"
      />

      <DisasterDetailModal
        visible={modalVisible}
        disaster={selectedDisaster}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});