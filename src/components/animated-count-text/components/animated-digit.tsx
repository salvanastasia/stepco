import { StyleSheet, Text } from 'react-native';

import { type FC, memo, useMemo } from 'react';

import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import type { StyleProp, TextStyle } from 'react-native';

type AnimatedDigitProps = {
  digit: number;
  height: number;
  width: number;
  textStyle: StyleProp<TextStyle>;
};

const AnimatedDigit: FC<AnimatedDigitProps> = memo(
  ({ digit, height, width, textStyle }) => {
    const flattenedTextStyle = useMemo(() => {
      return StyleSheet.flatten(textStyle);
    }, [textStyle]);

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withSpring(-height * digit, {
              duration: 1000,
              dampingRatio: 0.9,
            }),
          },
        ],
      };
    });

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={{
          height,
          width,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            {
              flexDirection: 'column',
            },
            rStyle,
          ]}
        >
          {new Array(10).fill(0).map((_, index) => {
            return (
              <Text
                key={index}
                className="font-bold"
                style={{
                  ...flattenedTextStyle,
                  width,
                  height,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                {index}
              </Text>
            );
          })}
        </Animated.View>
      </Animated.View>
    );
  }
);

export { AnimatedDigit };
