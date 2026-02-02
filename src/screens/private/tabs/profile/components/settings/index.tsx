import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLayout } from '../../../../../../features';
import Backdrop from '../../../../../../components/backdrop';
import { useStepHistoryStore } from '../../../../../../stores';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Canvas, Path, Skia, RoundedRect } from '@shopify/react-native-skia';

type Props = {
  ref: React.Ref<BottomSheetModal>;
};

const MIN_GOAL = 0;
const STEP_SIZE = 500;
const MAX_GOAL = 10000;
const TICK_COUNT = (MAX_GOAL - MIN_GOAL) / STEP_SIZE;
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => i);
const STEPS_TO_KM = 0.000762;

const formatGoal = (steps: number, unit: 'km' | 'steps') => {
  if (unit === 'km') {
    return (steps * STEPS_TO_KM).toFixed(2);
  }
  return steps.toString();
};

const snapPoints = ['40%'];

const { height } = Dimensions.get('window');

const SettingsBottomSheet = ({ ref }: Props) => {
  // #region states
  const goal = useStepHistoryStore((s) => s.goal);
  const unit = useStepHistoryStore((s) => s.unit);
  const setGoal = useStepHistoryStore((s) => s.setGoal);
  // #endregion
  // #region hooks
  const [{ width }, onLayout] = useLayout();
  const tooltipOpacity = useSharedValue(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevGoalRef = useRef(goal);
  // #endregion
  // #region callbacks
  const updateGoal = useCallback(
    (x: number) => {
      if (width <= 0) return;
      const percentage = Math.max(0, Math.min(1, x / width));
      const newGoal = Math.round(MIN_GOAL + percentage * (MAX_GOAL - MIN_GOAL));
      const snapped = Math.max(
        MIN_GOAL,
        Math.min(MAX_GOAL, Math.round(newGoal / STEP_SIZE) * STEP_SIZE)
      );
      if (snapped !== prevGoalRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        prevGoalRef.current = snapped;
      }
      setGoal(snapped);
    },
    [setGoal, width]
  );

  const showTooltip = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    tooltipOpacity.value = withSpring(1);
  }, [tooltipOpacity]);

  const hideTooltip = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      tooltipOpacity.value = withSpring(0);
    }, 1500);
  }, [tooltipOpacity]);
  // #endregion
  // #region gestures
  const composedGesture = useMemo(() => {
    const panGesture = Gesture.Pan()
      .runOnJS(true)
      .onStart((e) => {
        showTooltip();
        updateGoal(e.x);
      })
      .onUpdate((e) => updateGoal(e.x))
      .onEnd(() => hideTooltip());

    const tapGesture = Gesture.Tap()
      .runOnJS(true)
      .onEnd((e) => {
        showTooltip();
        updateGoal(e.x);
        hideTooltip();
      });

    return Gesture.Race(panGesture, tapGesture);
  }, [showTooltip, hideTooltip, updateGoal]);
  // #endregion
  // #region renders
  const filledCount = goal / STEP_SIZE;
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <Backdrop {...props} />,
    []
  );
  // #endregion
  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      detached={true}
      style={styles.root}
      snapPoints={snapPoints}
      containerStyle={styles.container}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView className="h-full p-8 justify-between">
        <Text className="text-[#BBBBBB] font-mono text-base tracking-wider">SET YOUR GOAL</Text>

        <View className="gap-4">
          <Text className="text-[#BBBBBB] font-mono text-base">Steps</Text>

          <GestureDetector gesture={composedGesture}>
            <View className="gap-4">
              {/* Tick marks with tooltip */}
              <View onLayout={onLayout} className="relative">
                <GoalTooltip goal={goal} unit={unit} trackWidth={width} opacity={tooltipOpacity} />
                <View className="flex-row justify-between items-center">
                  {TICKS.map((i) => (
                    <Tick key={i} index={i} isFilled={i < filledCount} />
                  ))}
                </View>
              </View>
              {/* Labels */}
              <GoalLabels unit={unit} />
            </View>
          </GestureDetector>
        </View>
        <UnitSelector />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default SettingsBottomSheet;

const styles = StyleSheet.create({
  root: { marginHorizontal: 32, height: height * 0.4 - 24 },
  handleIndicator: { display: 'none' },
  container: { justifyContent: 'center' },
  sheetBackground: {
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: '#111111',
  },
});

// Memoized Tick component - only re-renders when isFilled changes
type TickProps = { index: number; isFilled: boolean };
const Tick = memo(
  ({ isFilled }: TickProps) => (
    <View className={`h-10 w-1.5 rounded-sm ${isFilled ? 'bg-[#FFFFFF]' : 'bg-[#333333]'}`} />
  ),
  (prev, next) => prev.isFilled === next.isFilled
);

const TOOLTIP_WIDTH = 80;
const TOOLTIP_HEIGHT = 40;
const ARROW_SIZE = 8;
const STROKE_WIDTH = 2;
const INNER_MARGIN = 3;
const INNER_RADIUS = 10;
const BORDER_RADIUS = INNER_RADIUS + INNER_MARGIN;
const CANVAS_PADDING = 1;

const createTooltipSVGPath = (offsetX: number, offsetY: number) => {
  const w = TOOLTIP_WIDTH;
  const h = TOOLTIP_HEIGHT;
  const r = BORDER_RADIUS;
  const arrowW = ARROW_SIZE;
  const arrowH = ARROW_SIZE;
  const centerX = w / 2;
  const ox = offsetX;
  const oy = offsetY;

  return `
    M ${r + ox} ${oy}
    L ${w - r + ox} ${oy}
    A ${r} ${r} 0 0 1 ${w + ox} ${r + oy}
    L ${w + ox} ${h - r + oy}
    A ${r} ${r} 0 0 1 ${w - r + ox} ${h + oy}
    L ${centerX + arrowW + ox} ${h + oy}
    L ${centerX + ox} ${h + arrowH + oy}
    L ${centerX - arrowW + ox} ${h + oy}
    L ${r + ox} ${h + oy}
    A ${r} ${r} 0 0 1 ${ox} ${h - r + oy}
    L ${ox} ${r + oy}
    A ${r} ${r} 0 0 1 ${r + ox} ${oy}
    Z
  `;
};

const tooltipPathResult = Skia.Path.MakeFromSVGString(
  createTooltipSVGPath(CANVAS_PADDING, CANVAS_PADDING)
);
const tooltipPath = tooltipPathResult ?? Skia.Path.Make();

type GoalTooltipProps = {
  goal: number;
  unit: 'km' | 'steps';
  trackWidth: number;
  opacity: SharedValue<number>;
};

const TICK_WIDTH = 6; // w-1.5 in tailwind

const GoalTooltip = memo(({ goal, unit, trackWidth, opacity }: GoalTooltipProps) => {
  // #region hooks
  const translateX = useSharedValue(0);
  // #endregion
  // #region effects
  useEffect(() => {
    if (trackWidth <= 0) return;
    const totalWidth = TOOLTIP_WIDTH + CANVAS_PADDING * 2;
    // Last filled tick index (tick is filled when tickValue < goal)
    const lastFilledTickIndex = goal > 0 ? goal / STEP_SIZE - 1 : 0;
    // With justify-between: center(i) = TICK_WIDTH/2 + i * (trackWidth - TICK_WIDTH) / (TICK_COUNT - 1)
    const tickCenter =
      TICK_WIDTH / 2 + lastFilledTickIndex * ((trackWidth - TICK_WIDTH) / (TICK_COUNT - 1));
    const position = tickCenter - totalWidth / 2;
    translateX.value = withSpring(position, { duration: 250 });
  }, [goal, trackWidth, translateX]);
  // #endregion
  // #region styles
  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: (1 - opacity.value) * 10 },
      { scale: 0.9 + opacity.value * 0.1 },
    ],
  }));
  // #endregion
  return (
    <Animated.View style={[tooltipStyles.container, tooltipStyles.absolute, tooltipStyle]}>
      <Canvas style={tooltipStyles.canvas}>
        <Path path={tooltipPath} color="#111111" />
        <Path
          path={tooltipPath}
          color="#2A2A2A"
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeJoin="round"
          strokeCap="round"
        />
        <RoundedRect
          x={INNER_MARGIN + CANVAS_PADDING}
          y={INNER_MARGIN + CANVAS_PADDING}
          width={TOOLTIP_WIDTH - INNER_MARGIN * 2}
          height={TOOLTIP_HEIGHT - INNER_MARGIN * 2}
          r={INNER_RADIUS}
          color="#2A2A2A"
        />
      </Canvas>
      <View style={tooltipStyles.textContainer}>
        <Text className="text-white font-mono-semibold text-lg">{formatGoal(goal, unit)}</Text>
      </View>
    </Animated.View>
  );
});

const tooltipStyles = StyleSheet.create({
  container: {
    width: TOOLTIP_WIDTH + CANVAS_PADDING * 2,
    height: TOOLTIP_HEIGHT + ARROW_SIZE + CANVAS_PADDING * 2,
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    bottom: 44, // tick height (h-10)
  },
  canvas: {
    position: 'absolute',
    width: TOOLTIP_WIDTH + CANVAS_PADDING * 2,
    height: TOOLTIP_HEIGHT + ARROW_SIZE + CANVAS_PADDING * 2,
  },
  textContainer: {
    width: TOOLTIP_WIDTH + CANVAS_PADDING * 2,
    height: TOOLTIP_HEIGHT + CANVAS_PADDING,
    paddingTop: CANVAS_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const GOAL_LABELS = [MIN_GOAL, 5000, MAX_GOAL];

type GoalLabelsProps = {
  unit: 'km' | 'steps';
};

const MIDDLE_LABEL_WIDTH = 50;

const GoalLabels = memo(({ unit }: GoalLabelsProps) => (
  <View className="flex-row items-center justify-between relative">
    <Text className="text-[#666666] font-mono">{formatGoal(GOAL_LABELS[0], unit)}</Text>
    <Text
      className="text-[#666666] font-mono absolute text-center"
      style={goalLabelStyles.middle}
    >
      {formatGoal(GOAL_LABELS[1], unit)}
    </Text>
    <Text className="text-[#666666] font-mono">{formatGoal(GOAL_LABELS[2], unit)}</Text>
  </View>
));

const goalLabelStyles = StyleSheet.create({
  middle: {
    width: MIDDLE_LABEL_WIDTH,
    left: '50%',
    marginLeft: -MIDDLE_LABEL_WIDTH / 2,
  },
});

const UNIT_LABELS: ('km' | 'steps')[] = ['km', 'steps'];
const INDICATOR_PADDING = 2;

const UnitSelector = memo(() => {
  // #region states
  const unit = useStepHistoryStore((s) => s.unit);
  // #endregion
  // #region hooks
  const [{ width: containerWidth }, onLayout] = useLayout();
  const translateX = useSharedValue(0);
  // #endregion
  // #region callbacks
  const setUnit = useStepHistoryStore((s) => s.setUnit);
  // #endregion
  // #region effects
  const itemWidth = containerWidth > 0 ? (containerWidth - INDICATOR_PADDING * 2) / 2 : 0;
  const selectedIndex = UNIT_LABELS.indexOf(unit);
  useEffect(() => {
    translateX.value = withSpring(selectedIndex * (itemWidth - 2) + INDICATOR_PADDING, {
      duration: 250,
    });
  }, [selectedIndex, itemWidth, translateX]);
  // #endregion
  // #region styles
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  // #endregion
  // #region renders
  const renderItem = useCallback(
    (label: (typeof UNIT_LABELS)[number], index: number) => {
      return (
        <Pressable
          key={`${index}-${label}`}
          className="p-2 w-1/2 rounded-[8px] items-center justify-center"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setUnit(label);
          }}
        >
          <Text className="text-white font-mono-medium text-base uppercase">{label}</Text>
        </Pressable>
      );
    },
    [setUnit]
  );
  // #endregion
  return (
    <View className="gap-4">
      <Text className="text-[#BBBBBB] font-mono text-base">Unit</Text>

      <View
        onLayout={onLayout}
        className="bg-[#111] border border-[#333] rounded-[10px] flex-row w-3/5"
      >
        <Animated.View
          style={[unitStyles.indicator, { width: itemWidth }, indicatorStyle]}
          className="absolute top-[2px] bottom-[2px] bg-[#333] rounded-[8px]"
        />
        {UNIT_LABELS.map(renderItem)}
      </View>
    </View>
  );
});

const unitStyles = StyleSheet.create({
  indicator: {
    position: 'absolute',
  },
});
