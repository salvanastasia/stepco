import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CircularProgressProps {
  current: number;
  goal: number;
  radius?: number;
  dashCount?: number;
  isWalking: boolean;
  onStartWalk: () => void;
}

type DisplayMode = 'steps' | 'distance';

export default function CircularProgress({
  current,
  goal,
  radius = 140,
  dashCount = 60,
  isWalking,
  onStartWalk,
}: CircularProgressProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('steps');
  
  const progress = Math.min(current / goal, 1);
  const filledDashes = Math.floor(progress * dashCount);
  
  // Calculate distance: average step length is 0.762 meters
  const meters = current * 0.762;
  const kilometers = meters / 1000;
  
  // Toggle display mode
  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === 'steps' ? 'distance' : 'steps');
  };
  
  // Format display value and label
  const getDisplayValue = () => {
    if (displayMode === 'steps') {
      return current.toLocaleString('de-DE');
    } else {
      if (meters < 1000) {
        return Math.round(meters).toLocaleString('de-DE');
      } else {
        return kilometers.toFixed(2).replace('.', ',');
      }
    }
  };
  
  const getDisplayLabel = () => {
    if (displayMode === 'steps') {
      return 'steps';
    } else {
      return meters < 1000 ? 'meters' : 'kilometers';
    }
  };

  // Create array of dashes positioned in a circle
  const dashes = Array.from({ length: dashCount }, (_, i) => {
    const angle = (i / dashCount) * 2 * Math.PI - Math.PI / 2; // Start from top
    const isFilled = i < filledDashes;
    
    // Position dash at the edge of the circle
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Rotate dash to be perpendicular to the circle (pointing outward)
    const rotation = `${(angle + Math.PI / 2) * (180 / Math.PI)}deg`;

    return (
      <View
        key={i}
        style={[
          styles.dash,
          {
            backgroundColor: isFilled ? '#fff' : '#333',
            left: '50%',
            top: '50%',
            transform: [
              { translateX: -1 },
              { translateY: -16 },
              { translateX: x },
              { translateY: y },
              { rotate: rotation },
            ],
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressContainer, { width: radius * 2 + 100, height: radius * 2 + 100 }]}>
        <TouchableOpacity 
          style={styles.centerContent}
          onPress={toggleDisplayMode}
          activeOpacity={0.7}
        >
          <Text style={styles.stepsCount}>
            {getDisplayValue()}
          </Text>
          <Text style={styles.stepsLabel}>{getDisplayLabel()}</Text>
        </TouchableOpacity>
        {dashes}
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={onStartWalk}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isWalking ? 'WALKING...' : 'START WALK'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  progressContainer: {
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsCount: {
    fontSize: 48,
    color: '#fff',
    fontFamily: 'Archivo_700Bold',
  },
  stepsLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  dash: {
    position: 'absolute',
    height: 32,
    width: 2,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 100,
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontFamily: 'JetBrainsMono_600SemiBold',
    letterSpacing: 0.5,
  },
});
