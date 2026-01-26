import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

interface Position {
  latitude: number;
  longitude: number;
}

interface MapViewComponentProps {
  mapInteractionEnabled: boolean;
}

export default function MapViewComponent({ mapInteractionEnabled }: MapViewComponentProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pathCoords, setPathCoords] = useState<Position[]>([]);
  const mapRef = useState<MapView | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }

        // Get initial position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const newPos = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        setPosition(newPos);
        setPathCoords([newPos]);

        // Watch position changes
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 10,
          },
          (location) => {
            const newPos = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setPosition(newPos);
            setPathCoords(prev => [...prev, newPos]);
          }
        );
      } catch (err) {
        setError('Unable to get your location');
        console.error(err);
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{error}</Text>
        <Text style={styles.errorSubtext}>Please enable location permissions</Text>
      </View>
    );
  }

  if (!position) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          ...position,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={darkMapStyle}
        showsUserLocation={false}
        showsMyLocationButton={false}
        scrollEnabled={mapInteractionEnabled}
        zoomEnabled={mapInteractionEnabled}
        rotateEnabled={mapInteractionEnabled}
        pitchEnabled={mapInteractionEnabled}
        minZoomLevel={10}
        maxZoomLevel={20}
      >
        {position && (
          <Marker
            coordinate={position}
            title="Your Location"
          >
            <View style={styles.marker} />
          </Marker>
        )}
        
        {pathCoords.length > 1 && (
          <Polyline
            coordinates={pathCoords}
            strokeColor="#fff"
            strokeWidth={4}
            lineJoin="round"
            lineCap="round"
          />
        )}
      </MapView>
      
      <View style={styles.infoBox} pointerEvents="none">
        <Text style={styles.infoTitle}>
          {position ? 'Current Location' : 'Getting location...'}
        </Text>
        <Text style={styles.infoCoords}>
          {position 
            ? `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`
            : 'Please allow location access'
          }
        </Text>
      </View>
      
      {!mapInteractionEnabled && (
        <View style={styles.hint} pointerEvents="none">
          <Text style={styles.hintText}>Use 2 fingers to interact with map</Text>
        </View>
      )}
    </View>
  );
}

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1a' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#999' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1a1a1a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a2a2a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#333' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0a0a0a' }],
  },
];

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
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoBox: {
    position: 'absolute',
    top: 72,
    left: 32,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  infoCoords: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  hint: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
