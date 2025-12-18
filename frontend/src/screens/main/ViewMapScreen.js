import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import api from '../../api/apiClient';
import AppLoader from '../../components/common/AppLoader';
import { DisasterMarker, DisasterDetailModal } from './components';

/**
 * Screen showing a map with nearby disaster markers.
 * Users can tap markers to see details about each disaster.
 */
export default function ViewMapScreen({ navigation }) {
  const theme = useTheme();
  const [region, setRegion] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const regionRef = useRef(null); // Store region to avoid effect dependencies

  useEffect(() => {
    initializeMap();
  }, []);

  // ============ Initialization ============

  const initializeMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const newRegion = { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
      setRegion(newRegion);
      regionRef.current = newRegion;
      fetchDisasters(latitude, longitude);
    } catch (error) {
      console.error('Location error:', error);
      // Default to San Francisco
      const defaultLat = 37.78825;
      const defaultLng = -122.4324;
      const newRegion = { latitude: defaultLat, longitude: defaultLng, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
      setRegion(newRegion);
      regionRef.current = newRegion;
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
    setModalVisible(true); // Open modal when marker is pressed
  };

  const onCalloutPress = () => {
    setModalVisible(true);
  };

  // ============ Render ============

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
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          regionRef.current = newRegion;
        }}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        cacheEnabled={false}
        moveOnMarkerPress={false}
        toolbarEnabled={false} // Prevents extra UI that can cause layout shifts
      >
        {disasters.map((disaster, index) => (
          <DisasterMarker
            key={disaster._id || index}
            disaster={disaster}
            onPress={onMarkerPress}
            onCalloutPress={onCalloutPress}
          />
        ))}
      </MapView>

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
});