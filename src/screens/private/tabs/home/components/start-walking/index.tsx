import { Square } from 'lucide-react-native';
import { Text, Pressable } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  isWalking: boolean;
  onStart: () => void;
  onStop: () => void;
};

const StartWalking = ({ isWalking, onStart, onStop }: Props) => {
  return (
    <Animated.View layout={LinearTransition} className="flex-row justify-center items-center gap-4">
      <AnimatedPressable
        onPress={onStart}
        layout={LinearTransition}
        className="bg-white py-4 px-8 rounded-full z-10"
      >
        {isWalking ? (
          <Text className="text-background font-semibold text-lg">WALKING...</Text>
        ) : (
          <Text className="text-background font-semibold text-lg">START WALK</Text>
        )}
      </AnimatedPressable>

      {isWalking && (
        <AnimatedPressable
          onPress={onStop}
          entering={FadeInLeft}
          exiting={FadeOutLeft}
          className="bg-white p-4 rounded-full"
        >
          <Square size={18} color="#1a1a1a" strokeWidth={0} fill="#1a1a1a" />
        </AnimatedPressable>
      )}
    </Animated.View>
  );
};

export default StartWalking;
