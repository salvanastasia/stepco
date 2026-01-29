import { View } from 'react-native';
import { usePedometer } from '../../../../features/hooks/usePedometer';
import CircularProgress from '../../../../components-web/components/circular-progress-native';
import { DeleteButton } from '../../../../components/delete-button';

export default function HomeScreen() {
  const { steps, goal, start, stop } = usePedometer();

  return (
    <View className="bg-background flex-1 justify-center items-center gap-6">
      <CircularProgress current={steps} goal={goal} />
      <DeleteButton onClose={stop} onInitialClick={start} />
    </View>
  );
}
