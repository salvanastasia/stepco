import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { usePedometer } from '../../../../features/hooks/usePedometer';
import CircularProgress from '../../../../components-web/components/circular-progress-native';
import { DeleteButton, DeleteButtonRef } from '../../../../components/delete-button';

export default function HomeScreen() {
  // #region members
  const buttonRef = useRef<DeleteButtonRef>(null);
  // #endregion
  // #region hooks
  const { steps, goal, isWalking, start, stop } = usePedometer();
  // #endregion
  // #region effects
  // Auto-stop when goal is reached
  useEffect(() => {
    if (isWalking && steps >= goal && goal > 0) {
      buttonRef.current?.close();
    }
  }, [steps, goal, isWalking]);
  // #endregion
  // #region renders
  return (
    <View className="bg-background flex-1 justify-center items-center gap-6">
      <CircularProgress current={steps} goal={goal} />
      <DeleteButton ref={buttonRef} onClose={stop} onInitialClick={start} />
    </View>
  );
  // #endregion
}
