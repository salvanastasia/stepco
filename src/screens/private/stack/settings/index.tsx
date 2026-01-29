import { View, Text, TouchableOpacity } from 'react-native';
import { useStepHistoryStore } from '../../../../stores';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useLayout } from '../../../../features';
import { useCallback } from 'react';

const MIN_GOAL = 1000;
const STEP_SIZE = 500;
const MAX_GOAL = 10000;
const TICK_COUNT = (MAX_GOAL - MIN_GOAL) / STEP_SIZE + 1; // 19 ticks

const SettingsScreen = () => {
  // #region states
  const goal = useStepHistoryStore((s) => s.goal);
  const unit = useStepHistoryStore((s) => s.unit);
  const setGoal = useStepHistoryStore((s) => s.setGoal);
  const setUnit = useStepHistoryStore((s) => s.setUnit);
  // #endregion
  // #region hooks
  const [{ width }, onLayout] = useLayout();
  // #endregion
  // #region callbacks
  const updateGoal = useCallback(
    (x: number) => {
      if (width <= 0) return;
      const percentage = Math.max(0, Math.min(1, x / width));
      const newGoal = Math.round(MIN_GOAL + percentage * (MAX_GOAL - MIN_GOAL));
      const snapped = Math.round(newGoal / STEP_SIZE) * STEP_SIZE;
      setGoal(Math.max(MIN_GOAL, Math.min(MAX_GOAL, snapped)));
    },
    [setGoal, width]
  );
  // #endregion
  // #region gestures
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((e) => updateGoal(e.x))
    .onUpdate((e) => updateGoal(e.x));

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((e) => updateGoal(e.x));

  const composedGesture = Gesture.Race(panGesture, tapGesture);
  // #endregion

  // #region renders
  const renderTicks = useCallback(
    (_: unknown, i: number) => {
      const tickValue = MIN_GOAL + i * STEP_SIZE;
      const isFilled = tickValue <= goal;
      return (
        <View key={i} className={`h-10 w-3 rounded-sm ${isFilled ? 'bg-white' : 'bg-[#333]'}`} />
      );
    },
    [goal]
  );
  // #endregion
  return (
    <View className="flex-1 bg-[#111] p-8 gap-6 pt-safe">
      <Text className="text-[#bbb] font-mono text-sm tracking-wider">SET YOUR GOAL</Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-[#bbb] font-mono text-base">Steps</Text>
        <View className="bg-[#2a2a2a] px-4 py-2 rounded-lg">
          <Text className="text-white font-mono-semibold text-base">
            {goal.toLocaleString('de-DE')}
          </Text>
        </View>
      </View>

      <GestureDetector gesture={composedGesture}>
        <View onLayout={onLayout} className="px-2 gap-4">
          {/* Tick marks */}
          <View className="flex-row justify-between items-center gap-2">
            {Array.from({ length: TICK_COUNT }, renderTicks)}
          </View>

          {/* Labels */}
          <View className="flex-row items-center justify-between">
            <Text className="text-[#666] font-mono">{MIN_GOAL.toLocaleString('de-DE')}</Text>
            <Text className="text-[#666] font-mono">{(5000).toLocaleString('de-DE')}</Text>
            <Text className="text-[#666] font-mono">{MAX_GOAL.toLocaleString('de-DE')}</Text>
          </View>
        </View>
      </GestureDetector>

      <View className="gap-6">
        <Text className="text-[#bbb] font-mono text-base">Unit</Text>

        <View className="bg-[#111] border border-[#333] rounded-lg flex-row">
          <TouchableOpacity
            className={`flex-1 p-3 rounded-lg ${unit === 'km' ? 'bg-[#333]' : ''}`}
            onPress={() => {
              setUnit('km');
            }}
          >
            <Text className="text-white font-mono-medium text-base">KM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-3 rounded-lg ${unit === 'steps' ? 'bg-[#333]' : ''}`}
            onPress={() => {
              setUnit('steps');
            }}
          >
            <Text className="text-white font-mono-medium text-base">STEPS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
