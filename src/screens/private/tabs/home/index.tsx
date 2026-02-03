import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { usePedometer } from '../../../../features/hooks/usePedometer';
import CircularProgress from '../../../../components-web/components/circular-progress-native';
import { DeleteButton, DeleteButtonRef } from '../../../../components/delete-button';

export default function HomeScreen() {
  const { steps, goal, isWalking, start, stop } = usePedometer();
  const buttonRef = useRef<DeleteButtonRef>(null);

  // Auto-stop when goal is reached
  useEffect(() => {
    if (isWalking && steps >= goal && goal > 0) {
      buttonRef.current?.close();
    }
  }, [steps, goal, isWalking]);

  return (
    <View className="bg-background flex-1 justify-center items-center gap-6">
      <CircularProgress current={steps} goal={goal} />
      <DeleteButton ref={buttonRef} onClose={stop} onInitialClick={start} />
    </View>
  );
}
