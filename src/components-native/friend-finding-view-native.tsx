import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { X } from 'lucide-react-native';

interface FriendFindingViewProps {
  friendName: string;
  friendAvatar: any;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function FriendFindingView({ friendName, friendAvatar, onClose, theme = 'bw' }: FriendFindingViewProps) {
  const [distance, setDistance] = useState(150); // meters
  const [direction, setDirection] = useState(0); // degrees
  const [directionText, setDirectionText] = useState('ahead');
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';
  
  // User location (center of map)
  const userLocation = { latitude: 40.7580, longitude: -73.9855 }; // NYC coordinates
  
  // Friend location (slightly offset)
  const [friendLocation, setFriendLocation] = useState({ latitude: 40.7590, longitude: -73.9865 });

  // Simulate friend getting closer and direction changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(prev => {
        const newDist = Math.max(1, prev - Math.random() * 10);
        return newDist;
      });
      
      setDirection(prev => {
        const newDir = (prev + Math.random() * 20 - 10) % 360;
        
        // Animate rotation
        Animated.timing(rotateAnim, {
          toValue: newDir,
          duration: 500,
          useNativeDriver: true,
        }).start();
        
        return newDir;
      });
      
      // Update direction text based on angle
      const angle = direction;
      if (angle > 337.5 || angle <= 22.5) {
        setDirectionText('ahead');
      } else if (angle > 22.5 && angle <= 67.5) {
        setDirectionText('to your right');
      } else if (angle > 67.5 && angle <= 112.5) {
        setDirectionText('to your right');
      } else if (angle > 112.5 && angle <= 157.5) {
        setDirectionText('behind you');
      } else if (angle > 157.5 && angle <= 202.5) {
        setDirectionText('behind you');
      } else if (angle > 202.5 && angle <= 247.5) {
        setDirectionText('to your left');
      } else if (angle > 247.5 && angle <= 292.5) {
        setDirectionText('to your left');
      } else {
        setDirectionText('ahead');
      }

      // Update friend location to get closer
      setFriendLocation(prev => {
        const deltaLat = (userLocation.latitude - prev.latitude) * 0.05;
        const deltaLng = (userLocation.longitude - prev.longitude) * 0.05;
        return {
          latitude: prev.latitude + deltaLat,
          longitude: prev.longitude + deltaLng,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [direction]);

  const getDistanceCategory = () => {
    if (distance < 5) return 'nearby';
    if (distance < 50) return 'close';
    return 'far';
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top Half - Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            customMapStyle={darkMapStyle}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
          >
            {/* User marker */}
            <Marker coordinate={userLocation}>
              <View style={[styles.userMarker, { backgroundColor: accentColor }]}>
                <Text style={styles.userMarkerText}>YOU</Text>
              </View>
            </Marker>
            
            {/* Friend marker */}
            <Marker coordinate={friendLocation}>
              <View style={[styles.friendMarker, { borderColor: accentColor }]} />
            </Marker>
          </MapView>
        </View>

        {/* Bottom Half - Finding Interface */}
        <View style={styles.findingContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.findingLabel}>Finding</Text>
            <Text style={[styles.friendName, { color: accentColor }]}>{friendName}</Text>
          </View>

          {/* Directional Arrow and Distance */}
          <View style={styles.centerContent}>
            {/* Arrow */}
            <Animated.View style={[styles.arrowContainer, { transform: [{ rotate: rotateInterpolate }] }]}>
              <View style={[styles.arrow, { backgroundColor: accentColor }]} />
            </Animated.View>

            {/* Distance */}
            <View style={styles.distanceContainer}>
              <Text style={[styles.distanceNumber, { color: accentColor }]}>
                {distance < 2 ? '1' : Math.round(distance)}
                {distance >= 2 && <Text style={styles.distanceUnit}> m</Text>}
              </Text>
              <Text style={styles.directionText}>{directionText}</Text>
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.bottomButton}>
              <X size={24} color="#999" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerText: {
    fontSize: 10,
    fontFamily: 'JetBrainsMono_600SemiBold',
    color: '#1a1a1a',
  },
  friendMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: '#666',
  },
  findingContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  findingLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: 'JetBrainsMono_400Regular',
    marginBottom: 8,
  },
  friendName: {
    fontSize: 24,
    fontFamily: 'Archivo_400Regular',
    fontWeight: '200',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    marginBottom: 32,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  distanceContainer: {
    alignItems: 'center',
    gap: 4,
  },
  distanceNumber: {
    fontSize: 60,
    fontFamily: 'Archivo_400Regular',
    fontWeight: '200',
  },
  distanceUnit: {
    fontSize: 30,
    color: '#999',
  },
  directionText: {
    fontSize: 20,
    color: '#999',
    fontFamily: 'JetBrainsMono_400Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
