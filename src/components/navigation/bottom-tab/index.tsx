import Item from './item';
import { Animated, View } from 'react-native';
import { useLayout } from '../../../features';
import React, { useCallback, useMemo } from 'react';
import { NavigationState, SceneRendererProps } from 'react-native-tab-view';

type Props = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>;
  onItemClick: (index: number) => void;
};

const BottomTab: React.FC<Props> = ({ navigationState, position, onItemClick }) => {
  // #region members
  const inputRange = useMemo(
    () => navigationState.routes.map((_, i) => i),
    [navigationState.routes]
  );
  // #endregion
  // #region states

  // #endregion
  // #region custom hooks
  const [{ measured, width, height }, onLayout] = useLayout();
  // #endregion
  // #region functions
  const getTranslateX = (index: number, isText?: boolean) => {
    return Animated.multiply(
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((i) => {
          const diff = i - index;
          const x = width / navigationState.routes.length;
          return !isText ? (diff > 0 ? x : diff < 0 ? -x : 0) : -(diff > 0 ? x : diff < 0 ? -x : 0);
        }),
      }),
      1
    );
  };

  const handleOnItemClick = useCallback((index: number) => onItemClick(index), [onItemClick]);
  // #endregion
  // #region effects
  // #endregion
  // #region variables
  const renderItem = (route: { key: string; title: string }, index: number) => {
    return (
      <Item
        key={index}
        index={index}
        route={route}
        onPress={handleOnItemClick}
        translateX={(isText) => getTranslateX(index, isText)}
      />
    );
  };

  // #endregion
  return (
    <Animated.View className="p-4 overflow-hidden justify-center items-center">
      <View className="flex-row bg-neutral-800 rounded-2xl w-2/3 " onLayout={onLayout}>
        {measured && navigationState.routes.map((route, index) => renderItem(route, index))}
      </View>
    </Animated.View>
  );
};

export default BottomTab;

BottomTab.displayName = 'BottomTab';
