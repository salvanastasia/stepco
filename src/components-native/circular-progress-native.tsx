import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CircularProgressProps {
  current: number;
  goal: number;
  radius?: number;
  dashCount?: number;
  isCountdown?: boolean;
  theme?: 'bw' | 'bo';
  hideCenter?: boolean;
}

export default function CircularProgress({
  current,
  goal,
  radius = 140,
  dashCount = 60,
  isCountdown = false,
  theme = 'bw',
  hideCenter = false
}: CircularProgressProps) {
  const [displayMode, setDisplayMode] = useState(0); // 0: remaining, 1: taken, 2: distance

  // When in countdown mode, invert the progress so lines fill from 0 to 100%
  // as the countdown number decreases
  const progress = isCountdown 
    ? Math.min((goal - current) / goal, 1)  // Fill up as countdown decreases
    : Math.min(current / goal, 1);          // Normal fill up
  const filledDashes = Math.floor(progress * dashCount);

  // Calculate different display values
  const stepsTaken = isCountdown ? goal - current : current;
  const distanceKm = (stepsTaken * 0.762) / 1000; // Average step length

  const handleTap = () => {
    setDisplayMode((prev) => (prev + 1) % 3); // Cycle through 0, 1, 2
  };

  const getDisplayValue = () => {
    switch (displayMode) {
      case 0: // Remaining steps
        return current.toLocaleString('de-DE');
      case 1: // Steps taken
        return stepsTaken.toLocaleString('de-DE');
      case 2: // Distance
        if (distanceKm >= 1) {
          return distanceKm.toFixed(2).replace('.', ',');
        } else {
          const meters = Math.round(distanceKm * 1000);
          return meters.toLocaleString('de-DE');
        }
      default:
        return current.toLocaleString('de-DE');
    }
  };

  const getDisplayLabel = () => {
    switch (displayMode) {
      case 0:
        return 'steps';
      case 1:
        return 'steps';
      case 2:
        return distanceKm >= 1 ? 'km' : 'm';
      default:
        return 'steps';
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
    const rotation = angle + Math.PI / 2;

    return (
      <View
        key={i}
        style={[
          styles.dash,
          {
            backgroundColor: isFilled ? (theme === 'bo' ? '#ff4400' : '#ffffff') : '#333333',
            left: '50%',
            top: '50%',
            transform: [
              { translateX: -1 }, // Half of width (2px / 2)
              { translateY: -16 }, // Half of height (32px / 2)
              { translateX: x },
              { translateY: y },
              { rotate: `${rotation}rad` }
            ]
          }
        ]}
      />
    );
  });

  const containerSize = radius * 2 + 100;

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {!hideCenter && (
        <View style={styles.centerContainer}>
          <TouchableOpacity onPress={handleTap} style={styles.centerContent}>
            <Text style={styles.valueText}>{getDisplayValue()}</Text>
            <Text style={styles.labelText}>{getDisplayLabel()}</Text>
          </TouchableOpacity>
        </View>
      )}
      {dashes}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  valueText: {
    fontSize: 60,
    color: '#ffffff',
    fontFamily: 'Archivo_400Regular',
    fontWeight: '200',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    fontFamily: 'JetBrainsMono_400Regular',
    includeFontPadding: false,
  },
  dash: {
    position: 'absolute',
    width: 2,
    height: 32,
  },
});
