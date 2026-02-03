import { useMemo, useRef } from 'react';
import type { ComponentRef } from 'react';
import { StyleSheet } from 'react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { MapView, Camera } from '@maplibre/maplibre-react-native';
import { generateMapStyle, MAP_COLORS } from '../../features/lib';
import Animated, { LinearTransition } from 'react-native-reanimated';

// Default coordinates (Tirana)
const MIN_ZOOM = 8; // Don't show continents/world view
const MAX_ZOOM = 18; // Maximum detail level
const DEFAULT_ZOOM = 14;
const DEFAULT_CENTER: [number, number] = [19.8187, 41.3275];

// TODO: Replace with actual user avatar URL
interface MapProps {
  theme?: 'dark' | 'light';
}

export const Map = ({ theme = 'dark' }: MapProps) => {
  // #region members
  const mapRef = useRef<ComponentRef<typeof MapView>>(null);
  const cameraRef = useRef<CameraRef>(null);
  // #endregion
  // #region hooks
  // #endregion

  // #region members
  const mapStyle = useMemo(() => {
    const colors = MAP_COLORS[theme];
    return generateMapStyle(colors);
  }, [theme]);
  // #endregion

  // #region callbacks
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
          followUserLocation={false}
          centerCoordinate={DEFAULT_CENTER}
          defaultSettings={{ centerCoordinate: DEFAULT_CENTER }}
        />
      </MapView>
    </Animated.View>
  );
};
