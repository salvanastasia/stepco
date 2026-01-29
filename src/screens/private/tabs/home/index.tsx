import { View } from 'react-native';
import { StartWalking } from './components';
import { usePedometer } from '../../../../features/hooks/usePedometer';
import CircularProgress from '../../../../components-web/components/circular-progress-native';

export default function HomeScreen() {
  const { steps, goal, isWalking, start, stop } = usePedometer();

  return (
    <View className="bg-background flex-1 justify-center gap-6">
      <CircularProgress current={steps} goal={goal} />
      <StartWalking isWalking={isWalking} onStart={start} onStop={stop} />
    </View>
  );
}
