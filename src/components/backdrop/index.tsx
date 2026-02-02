import { TouchableWithoutFeedback } from 'react-native';
import React, { memo, useMemo } from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { BottomSheetBackdropProps, useBottomSheetModal } from '@gorhom/bottom-sheet';

type Props = BottomSheetBackdropProps;

const Backdrop = ({ animatedIndex, style }: Props) => {
  // #region members
  // #endregion
  // #region states
  // #endregion
  // #region custom hooks
  const { dismiss } = useBottomSheetModal();
  // #endregion
  // #region functions
  const onDismiss = () => {
    dismiss();
  };
  // #endregion
  // #region effects
  // #endregion
  // #region variables
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], 'clamp'),
    };
  });

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#00000080',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );
  // #endregion
  return (
    <TouchableWithoutFeedback onPress={onDismiss}>
      <Animated.View style={containerStyle} className="absolute inset-0" />
    </TouchableWithoutFeedback>
  );
};

export default memo(Backdrop);

Backdrop.displayName = 'Backdrop';
