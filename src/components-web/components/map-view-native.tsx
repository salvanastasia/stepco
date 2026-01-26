import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

interface Position {
  latitude: number;
  longitude: number;
}

export default function MapViewComponent() {
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
    <View style={styles.container} pointerEvents="box-none">
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
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        minZoomLevel={10}
        maxZoomLevel={20}
        pointerEvents="none"
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
            strokeColor="#ff6600"
            strokeWidth={5}
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
      
    </View>
  );
}

const darkMapStyle = [
  // Base map - very dark
  {
    elementType: 'geometry',
    stylers: [{ color: '#0d0d0d' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#666666' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0d0d0d' }],
  },
  // Roads - dark grey
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#2a2a2a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#262626' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#333333' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#1f1f1f' }],
  },
  // Water - very dark
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#404040' }],
  },
  // Parks/landscape - dark grey
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#0d0d0d' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#121212' }],
  },
  // POI - minimal visibility
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1a' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0f0f0f' }],
  },
  // Transit - very subtle
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a1a' }],
  },
  // Administrative - dark borders
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#2a2a2a' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [{ visibility: 'off' }],
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
    fontFamily: 'Archivo_600SemiBold',
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff6600',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  infoBox: {
    position: 'absolute',
    top: 72,
    left: 32,
    backgroundColor: '#0d0d0d',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'JetBrainsMono_500Medium',
  },
  infoCoords: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});
