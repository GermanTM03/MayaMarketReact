import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyC-ANnc-oput1foHBO-zFdU93pTW0ETZkA'; // Reemplaza con tu API Key de Google Maps

const MapaScreen = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  const sourceUri = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mapa</title>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}"></script>
        <style>
          #map {
            height: 100%;
            width: 100%;
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          function initMap() {
            const userLocation = { lat: ${userLocation.lat}, lng: ${userLocation.lng} };
            const targetLocation = { lat: 21.049654, lng: -86.846866 };

            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 13,
              center: userLocation,
            });
            new google.maps.Marker({
              position: userLocation,
              map,
              title: 'Tu ubicación',
            });

            new google.maps.Marker({
              position: targetLocation,
              map,
              title: 'Universidad Tecnológica de Cancún',
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

            directionsService.route(
              {
                origin: userLocation,
                destination: targetLocation,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (response, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(response);
                } else {
                  console.error('Error al obtener la ruta:', status);
                }
              }
            );
          }

          window.onload = initMap;
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html: sourceUri }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default MapaScreen;
