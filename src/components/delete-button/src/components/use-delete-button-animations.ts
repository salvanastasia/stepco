import * as Haptics from 'expo-haptics';
import { useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useGestureHandler } from 'react-native-skia-gesture';
import { scheduleOnRN } from 'react-native-worklets';
import colors from 'tailwindcss/colors';
type UseDeleteButtonAnimationsParams = {
  additionalWidth: number;
  onDelete: () => void;
  onInitialClick?: () => void;
};

export const useDeleteButtonAnimations = ({
  additionalWidth,
  onDelete,
  onInitialClick,
}: UseDeleteButtonAnimationsParams) => {
  const isToggled = useSharedValue(false);
  const isButtonPressed = useSharedValue(false);

  const deleteButtonRectX = useDerivedValue(() => {
    return withSpring(isToggled.value ? 0 : additionalWidth / 2);
  }, []);

  const deleteButtonColor = useDerivedValue(() => {
    return withTiming(isToggled.value ? colors.fuchsia[600] : 'white');
  }, []);

  const gestureHandler = useGestureHandler({
    onStart: () => {
      'worklet';
      isButtonPressed.value = true;
    },
    onTap: () => {
      'worklet';
      isButtonPressed.value = false;
      scheduleOnRN(Haptics.selectionAsync);
      if (isToggled.value) {
        return scheduleOnRN(onDelete);
      }
      isToggled.value = true;
      if (onInitialClick) {
        scheduleOnRN(onInitialClick);
      }
    },
  });

  const scale = useDerivedValue(() => {
    return withSpring(isButtonPressed.value ? 0.95 : 1);
  }, []);

  const buttonTransform = useDerivedValue(() => {
    return [{ scale: scale.value }];
  }, []);

  return {
    isToggled,
    gestureHandler,
    buttonTransform,
    deleteButtonRectX,
    deleteButtonColor,
  };
};
