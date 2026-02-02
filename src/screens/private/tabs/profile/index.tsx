import { useMemo, useRef } from 'react';
import { Settings } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { HistoryItem, SettingsBottomSheet } from './components';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { StepRecord, useStepHistoryStore } from '../../../../stores/step-history';

export default function ProfileScreen() {
  // #region members
  const settingsReference = useRef<BottomSheetModal>(null);
  // #endregion
  // #region hooks
  const goal = useStepHistoryStore((s) => s.goal);
  const unit = useStepHistoryStore((s) => s.unit);
  const stepHistory = useStepHistoryStore((s) => s.stepHistory);
  // #endregion
  // #region callbacks
  const handleOnShowSettings = () => settingsReference.current?.present();
  // #endregion
  // #region renders
  const renderItem = ({ item }: { item: StepRecord }) => {
    const percentage = Math.round((item.steps / goal) * 100);
    const isComplete = item.steps >= goal;
    return <HistoryItem item={item} isComplete={isComplete} percentage={percentage} unit={unit} />;
  };

  const renderEmptyComponent = useMemo(() => {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-lg font-archivo-semibold">No walks recorded yet</Text>
        <Text className="text-gray-400 text-base font-jetbrains-mono">
          Start a walk to see your activity here
        </Text>
      </View>
    );
  }, []);
  // #endregion
  return (
    <View className="flex-1 bg-background gap-4">
      {/* Header */}
      <View className="pt-safe">
        <View className="px-8 py-4 flex-row justify-between items-center">
          <Text className="font-archivo-bold text-white text-3xl">Activity</Text>
          <TouchableOpacity className="p-2 rounded-lg" onPress={handleOnShowSettings}>
            <Settings size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={stepHistory}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerClassName="flex-grow px-8 gap-2"
        keyExtractor={(item, index) => `${item.date.toISOString()}-${index}`}
      />
      <SettingsBottomSheet ref={settingsReference} />
    </View>
  );
}
