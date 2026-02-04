import { StyleSheet, Platform, View, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

interface MapViewProps {
  theme?: 'bw' | 'bo';
}

export default function MapViewComponent({ theme = 'bw' }: MapViewProps) {
  // Web doesn't support react-native-maps, show placeholder
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.map, styles.webPlaceholder]}>
        <Text style={styles.webText}>Map view (mobile only)</Text>
      </View>
    );
  }

  // Default location (NYC)
  const initialRegion = {
    latitude: 40.7580,
    longitude: -73.9855,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Sample walk path
  const walkPath = [
    { latitude: 40.7580, longitude: -73.9855 },
    { latitude: 40.7590, longitude: -73.9860 },
    { latitude: 40.7600, longitude: -73.9850 },
  ];

  const markerColor = theme === 'bo' ? '#ff4400' : '#4287f5';

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      customMapStyle={darkMapStyle}
      showsUserLocation={true}
      showsMyLocationButton={true}
      pointerEvents="auto"
    >
      {/* Start marker */}
      <Marker
        coordinate={walkPath[0]}
        pinColor={markerColor}
        title="Start"
      />

      {/* End marker */}
      <Marker
        coordinate={walkPath[walkPath.length - 1]}
        pinColor={markerColor}
        title="Current"
      />

      {/* Walk path */}
      <Polyline
        coordinates={walkPath}
        strokeColor={markerColor}
        strokeWidth={3}
      />
    </MapView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webPlaceholder: {
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webText: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});
