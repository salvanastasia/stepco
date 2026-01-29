import { View, Text, Pressable } from 'react-native';
import { StartWalking } from './components';
import { usePedometer } from '../../../../features/hooks/usePedometer';
import { useStepHistoryStore } from '../../../../stores/step-history';
import CircularProgress from '../../../../components-web/components/circular-progress-native';

export default function HomeScreen() {
  const { steps, goal, isWalking, start, stop } = usePedometer();

  const clearHistory = useStepHistoryStore((s) => s.clearHistory);

  const reset = () => {
    clearHistory();
  };

  return (
    <View className="bg-background flex-1 justify-center gap-6">
      <CircularProgress current={steps} goal={goal} />
      <StartWalking isWalking={isWalking} onStart={start} onStop={stop} />

      {__DEV__ && (
        <Pressable onPress={reset} className="absolute bottom-10 right-4 bg-red-500 px-4 py-2 rounded">
          <Text className="text-white font-bold">RESET</Text>
        </Pressable>
      )}
    </View>
  );
}
