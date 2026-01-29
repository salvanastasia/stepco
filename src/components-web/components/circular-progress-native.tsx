import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStepHistoryStore } from '../../stores/step-history';

type Props = {
  current: number;
  goal: number;
  radius?: number;
  dashCount?: number;
};

export default function CircularProgress({ current, goal, radius = 140, dashCount = 60 }: Props) {
  const unit = useStepHistoryStore((s) => s.unit);
  const setUnit = useStepHistoryStore((s) => s.setUnit);

  const progress = Math.min(current / goal, 1);
  const filledDashes = Math.floor(progress * dashCount);

  // Calculate distance: average step length is 0.762 meters
  const meters = current * 0.762;
  const kilometers = meters / 1000;

  const toggleUnit = () => {
    setUnit(unit === 'steps' ? 'km' : 'steps');
  };

  const getDisplayValue = () => {
    if (unit === 'steps') {
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
    if (unit === 'steps') {
      return 'steps';
    } else {
      return meters < 1000 ? 'meters' : 'kilometers';
    }
  };

  const dashes = Array.from({ length: dashCount }, (_, i) => {
    const angle = (i / dashCount) * 2 * Math.PI - Math.PI / 2;
    const isFilled = i < filledDashes;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
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
    <View className="items-center">
      <View style={{ width: radius * 2 + 100, height: radius * 2 + 100 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleUnit}
          className="absolute inset-0 justify-center items-center"
        >
          <Text style={styles.stepsCount}>{getDisplayValue()}</Text>
          <Text style={styles.stepsLabel}>{getDisplayLabel()}</Text>
        </TouchableOpacity>
        {dashes}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 2,
    height: 32,
    position: 'absolute',
  },
});
