import { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStepHistoryStore } from '../../stores/step-history';
import { AnimatedCount } from '../../components/animated-count-text/components/animated-count';

type Props = {
  current: number;
  goal: number;
  radius?: number;
  dashCount?: number;
};

type DashProps = {
  index: number;
  isFilled: boolean;
  radius: number;
  dashCount: number;
};

const Dash = memo(
  ({ index, isFilled, radius, dashCount }: DashProps) => {
    const angle = (index / dashCount) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const rotation = `${(angle + Math.PI / 2) * (180 / Math.PI)}deg`;

    return (
      <View
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
  },
  (prev, next) => prev.isFilled === next.isFilled && prev.radius === next.radius
);

function CircularProgress({ current, goal, radius = 140, dashCount = 60 }: Props) {
  const unit = useStepHistoryStore((s) => s.unit);
  const setUnit = useStepHistoryStore((s) => s.setUnit);

  const remaining = Math.max(goal - current, 0);
  const progress = goal > 0 ? Math.min(current / goal, 1) : 0;
  const filledDashes = Math.floor(progress * dashCount);

  // Calculate distance: average step length is 0.762 meters
  const remainingMeters = remaining * 0.762;
  const remainingKilometers = remainingMeters / 1000;

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'steps' ? 'km' : 'steps');
  }, [unit, setUnit]);

  const displayValue = useMemo(() => {
    if (unit === 'steps') {
      return remaining;
    } else {
      if (remainingMeters < 1000) {
        return Math.round(remainingMeters);
      } else {
        return remainingKilometers.toFixed(2).replace('.', ',');
      }
    }
  }, [unit, remaining, remainingMeters, remainingKilometers]);

  const displayLabel = useMemo(() => {
    if (unit === 'steps') {
      return 'steps left';
    } else {
      return remainingMeters < 1000 ? 'meters left' : 'km left';
    }
  }, [unit, remainingMeters]);

  // Pre-calculate dash indices for stable array
  const dashIndices = useMemo(
    () => Array.from({ length: dashCount }, (_, i) => i),
    [dashCount]
  );

  return (
    <View className="items-center">
      <View style={{ width: radius * 2 + 100, height: radius * 2 + 100 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleUnit}
          className="absolute inset-0 justify-center items-center"
        >
          <AnimatedCount number={displayValue} />
          <Text style={styles.stepsLabel}>{displayLabel}</Text>
        </TouchableOpacity>
        {dashIndices.map((i) => (
          <Dash
            key={i}
            index={i}
            isFilled={i < filledDashes}
            radius={radius}
            dashCount={dashCount}
          />
        ))}
      </View>
    </View>
  );
}

export default memo(CircularProgress);

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
