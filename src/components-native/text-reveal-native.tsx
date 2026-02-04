import { useEffect, useRef } from 'react';
import { Animated, Text, TextStyle } from 'react-native';

interface TextRevealProps {
  children: string;
  variant?: 'blur' | 'default';
  style?: TextStyle;
  delay?: number;
}

export function TextReveal({ children, variant = 'default', style, delay = 0 }: TextRevealProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(variant === 'blur' ? 0 : 8)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: variant === 'blur' ? 1200 : 800,
      delay,
      useNativeDriver: true,
    }).start();

    if (variant === 'default') {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  return (
    <Animated.Text
      style={[
        style,
        {
          opacity,
          transform: variant === 'default' ? [{ translateY }] : undefined,
        },
      ]}
    >
      {children}
    </Animated.Text>
  );
}
