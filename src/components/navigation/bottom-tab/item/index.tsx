import React, { memo, useMemo } from 'react';
import { Home, Map, User } from 'lucide-react-native';
import { Animated, Pressable, View } from 'react-native';

type Props = {
  index: number;
  route: { key: string; title: string };
  onPress: (args: number) => void;
  translateX: (isText?: boolean) => Animated.AnimatedMultiplication<string | number>;
};

const Item: React.FC<Props> = ({ index, route, translateX, onPress }) => {
  // #region functions
  const handleOnPress = () => onPress(index);
  // #endregion
  // #region renders
  const renderIcon = useMemo(
    () => (color: string, key: string) => {
      const _icon: Record<string, React.ReactElement> = {
        home: <Home color={color} />,
        map: <Map color={color} />,
        profile: <User color={color} />,
      };
      return _icon[key];
    },
    []
  );
  // #endregion
  return (
    <Pressable className="flex-1 overflow-hidden" onPress={handleOnPress}>
      <View className="items-center p-6">{renderIcon('#999999', route.key)}</View>

      <Animated.View
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: [{ translateX: translateX() }],
        }}
      >
        <View className="flex-1 bg-neutral-700 m-2 rounded-xl">
          <Animated.View
            className="items-center flex-1 justify-center"
            style={{ transform: [{ translateX: translateX(true) }] }}
          >
            {renderIcon('white', route.key)}
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default memo(Item);

Item.displayName = 'Item';
