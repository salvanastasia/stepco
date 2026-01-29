import React from 'react';
import { View, Text } from 'react-native';
import { StepRecord } from '../../../../../../stores';
import { isToday, isYesterday, format } from 'date-fns';

const formatDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
};

const convertToKm = (steps: number) => {
  return (steps * 0.000762).toFixed(2);
};

type Props = {
  item: StepRecord;
  isComplete: boolean;
  percentage: number;
  unit: 'steps' | 'km';
};

const HistoryItem = ({ item, isComplete, percentage, unit }: Props) => {
  return (
    <View className="bg-[#2a2a2a] rounded-md p-4 border border-[#3a3a3a]">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white font-jetbrains-mono-medium text-sm">
            {formatDate(item.date)}
          </Text>
          <Text className="text-gray-400 font-jetbrains-mono-regular text-sm">
            {unit === 'steps'
              ? `${item.steps.toLocaleString()} steps`
              : `${convertToKm(item.steps)} km`}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Text
            className={`text-sm font-jetbrains-mono-semibold ${isComplete ? 'text-teal-400' : 'text-[#999]'}`}
          >
            {percentage}%
          </Text>
          <View className="h-2 bg-background rounded-xl w-28 overflow-hidden">
            <View
              className={`h-full rounded-xl ${isComplete ? 'bg-teal-400' : 'bg-[#fff]'} `}
              style={{
                width: `${Math.min(percentage, 100)}%`,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;
