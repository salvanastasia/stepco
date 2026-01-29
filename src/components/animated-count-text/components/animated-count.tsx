import { type FC, memo, useMemo } from 'react';
import { Text } from 'react-native';

import Animated, { LinearTransition } from 'react-native-reanimated';

import { AnimatedDigit } from './animated-digit';

// Constants for the dimensions and styling of the animated digits
const TEXT_DIGIT_HEIGHT = 56;
const TEXT_DIGIT_WIDTH = 30;
const FONT_SIZE = 48;

// Define the prop types for the AnimatedCount component
type AnimatedCountProps = {
  number: number | string;
};

type ParsedChar = { type: 'digit'; value: number } | { type: 'separator'; value: string };

// AnimatedCount component
const AnimatedCount: FC<AnimatedCountProps> = memo(({ number }) => {
  // Split the number into individual digits and separators
  const chars = useMemo((): ParsedChar[] => {
    return number
      .toString()
      .split('')
      .map((char): ParsedChar => {
        const parsed = parseInt(char, 10);
        if (isNaN(parsed)) {
          return { type: 'separator', value: char };
        }
        return { type: 'digit', value: parsed };
      });
  }, [number]);

  // Render the animated digits and separators
  return (
    <Animated.View
      layout={LinearTransition.springify()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {chars.map((char, index) => {
        if (char.type === 'separator') {
          return (
            <Text
              key={`sep-${index}`}
              style={{
                color: 'white',
                fontSize: FONT_SIZE,
                fontWeight: 'bold',
                height: TEXT_DIGIT_HEIGHT,
                lineHeight: TEXT_DIGIT_HEIGHT,
              }}
            >
              {char.value}
            </Text>
          );
        }
        return (
          <AnimatedDigit
            key={`digit-${index}`}
            digit={char.value}
            height={TEXT_DIGIT_HEIGHT}
            width={TEXT_DIGIT_WIDTH}
            textStyle={{
              color: 'white',
              fontSize: FONT_SIZE,
              fontWeight: 'bold',
            }}
          />
        );
      })}
    </Animated.View>
  );
});

export { AnimatedCount };
