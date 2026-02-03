import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { ComponentRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { MapView, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import { generateMapStyle, MAP_COLORS } from '../../features/lib';
import Animated, { LinearTransition } from 'react-native-reanimated';
import * as Location from 'expo-location';

// Default coordinates (Tirana)
const MIN_ZOOM = 8; // Don't show continents/world view
const MAX_ZOOM = 18; // Maximum detail level
const DEFAULT_ZOOM = 16;
const DEFAULT_CENTER: [number, number] = [19.8187, 41.3275];

interface MapProps {
  theme?: 'dark' | 'light';
}

export const Map = ({ theme = 'dark' }: MapProps) => {
  // #region members
  const mapRef = useRef<ComponentRef<typeof MapView>>(null);
  const cameraRef = useRef<CameraRef>(null);
  // #endregion
  // #region states
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  // #endregion
  // #region hooks
  const mapStyle = useMemo(() => {
    const colors = MAP_COLORS[theme];
    return generateMapStyle(colors);
  }, [theme]);
  // #endregion
  // #region callbacks
  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Enable location access in Settings to see your position on the map');
      return false;
    }
    setHasPermission(true);
    return true;
  }, []);
  // #endregion
  // #region effects
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const granted = await requestPermission();
      if (!granted) return;

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation([initialLocation.coords.longitude, initialLocation.coords.latitude]);

      // Watch location updates
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Update every 5 meters
          timeInterval: 1000, // Or every second
        },
        (location) => {
          setUserLocation([location.coords.longitude, location.coords.latitude]);
        }
      );
    };

    startWatching();

    return () => {
      subscription?.remove();
    };
  }, [requestPermission]);
  // #endregion
  // #region renders
  // #endregion
  return (
    <Animated.View layout={LinearTransition} className="min-h-64 flex-grow">
      <MapView
        ref={mapRef}
        logoEnabled={false}
        compassEnabled={false}
        attributionEnabled={false}
        style={StyleSheet.absoluteFill}
        mapStyle={JSON.stringify(mapStyle)}
      >
        <Camera
          ref={cameraRef}
          animationMode="flyTo"
          minZoomLevel={MIN_ZOOM}
          maxZoomLevel={MAX_ZOOM}
          zoomLevel={DEFAULT_ZOOM}
          followUserLocation={hasPermission}
          followUserMode="normal"
          centerCoordinate={userLocation ?? DEFAULT_CENTER}
          defaultSettings={{ centerCoordinate: DEFAULT_CENTER }}
        />
        {hasPermission && <UserLocation visible animated />}
      </MapView>
    </Animated.View>
  );
};
