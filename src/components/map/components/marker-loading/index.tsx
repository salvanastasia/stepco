import { useThemeColor } from '@/components/ui';
import { View, ActivityIndicator } from 'react-native';

const MarkerLoading = () => {
  // #region hooks
  const foregroundColor = useThemeColor('foreground');
  // #endregion
  return (
    <View className="p-2 bg-surface rounded-full">
      <ActivityIndicator size="small" color={foregroundColor} />
    </View>
  );
};

export default MarkerLoading;
