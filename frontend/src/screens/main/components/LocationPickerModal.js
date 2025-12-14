import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AppButton from '../../../components/common/AppButton';

/**
 * Modal component for picking a location on a Google Maps WebView.
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onLocationSelected - Callback when location is picked (lat, lng)
 * @param {number} props.initialLat - Initial latitude for map center
 * @param {number} props.initialLng - Initial longitude for map center
 */
const LocationPickerModal = ({
    visible,
    onClose,
    onLocationSelected,
    initialLat = 37.78825,
    initialLng = -122.4324
}) => {
    const generateMapHTML = () => {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map; let marker;
            function initMap() {
              map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: ${initialLat}, lng: ${initialLng} },
                zoom: 12,
              });
              map.addListener('click', function(e) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                if (marker) marker.setMap(null);
                marker = new google.maps.Marker({ position: { lat, lng }, map });
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pickLocation', lat, lng }));
              });
            }
          </script>
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap" async defer></script>
        </body>
      </html>
    `;
    };

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'pickLocation') {
                onLocationSelected(data.lat, data.lng);
                onClose();
            }
        } catch (error) {
            console.error('Error parsing picker message:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <WebView
                    originWhitelist={["*"]}
                    source={{ html: generateMapHTML() }}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
                <AppButton
                    mode="contained"
                    text="Close Map"
                    onPress={onClose}
                    style={styles.closeButton}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        margin: 20,
    },
});

export default LocationPickerModal;
