import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { HistoryItem } from './components';
import { Settings } from 'lucide-react-native';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { StepRecord, useStepHistoryStore } from '../../../../stores/step-history';
import SettingsModal from '../../../../components-web/components/settings-modal-native';

export default function ProfileScreen() {
  const stepHistory = useStepHistoryStore((s) => s.stepHistory);
  const goal = useStepHistoryStore((s) => s.goal);
  const unit = useStepHistoryStore((s) => s.unit);
  const setGoal = useStepHistoryStore((s) => s.setGoal);
  const setUnit = useStepHistoryStore((s) => s.setUnit);

  const [showSettings, setShowSettings] = useState(false);

  const renderItem = ({ item }: { item: StepRecord }) => {
    const percentage = Math.round((item.steps / goal) * 100);
    const isComplete = item.steps >= goal;
    return <HistoryItem item={item} isComplete={isComplete} percentage={percentage} unit={unit} />;
  };
  const renderEmtyComponent = useMemo(() => {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-lg font-archivo-semibold">No walks recorded yet</Text>
        <Text className="text-gray-400 text-base font-jetbrains-mono">
          Start a walk to see your activity here
        </Text>
      </View>
    );
  }, []);
  return (
    <View className="flex-1 bg-background gap-4">
      {/* Header */}
      <View className="pt-safe">
        <View className="px-8 py-4 flex-row justify-between items-center">
          <Text className="font-archivo-bold text-white text-3xl">Activity</Text>
          <Link
            asChild
            href={{
              pathname: '/settings',
            }}
          >
            <TouchableOpacity className="p-2 rounded-lg">
              <Settings size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={stepHistory}
        renderItem={renderItem}
        ListEmptyComponent={renderEmtyComponent}
        contentContainerClassName="flex-grow px-8 gap-2"
        keyExtractor={(item, index) => `${item.date.toISOString()}-${index}`}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        dailyGoal={goal}
        onGoalChange={setGoal}
        unit={unit}
        onUnitChange={setUnit}
      />
    </View>
  );
}
