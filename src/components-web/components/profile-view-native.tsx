import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import SettingsModal from './settings-modal-native';

interface StepRecord {
  date: string;
  steps: number;
}

export default function ProfileView() {
  const [showSettings, setShowSettings] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [unit, setUnit] = useState<'steps' | 'km'>('steps');

  const stepHistory: StepRecord[] = [
    { date: '2026-01-26', steps: 6847 },
    { date: '2026-01-25', steps: 12453 },
    { date: '2026-01-24', steps: 9876 },
    { date: '2026-01-23', steps: 8234 },
    { date: '2026-01-22', steps: 11290 },
    { date: '2026-01-21', steps: 7654 },
    { date: '2026-01-20', steps: 10234 },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-01-26');
    const yesterday = new Date('2026-01-25');
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const convertToKm = (steps: number) => {
    return (steps * 0.000762).toFixed(2);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Header */}
      <View style={styles.header} pointerEvents="box-none">
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity
          onPress={() => setShowSettings(!showSettings)}
          style={styles.settingsButton}
          pointerEvents="auto"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 
        History List ScrollView
        
        directionalLockEnabled: Locks to vertical scroll after user starts scrolling
        This allows horizontal swipes to work for page navigation
        while preserving vertical scroll functionality
      */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled={true}
        alwaysBounceVertical={true}
        alwaysBounceHorizontal={false}
      >
        {stepHistory.map((record) => {
          const percentage = Math.round((record.steps / dailyGoal) * 100);
          const isComplete = record.steps >= dailyGoal;
          
          return (
            <View key={record.date} style={styles.recordCard}>
              <View style={styles.recordContent}>
                <View>
                  <Text style={styles.recordDate}>
                    {formatDate(record.date)}
                  </Text>
                  <Text style={styles.recordSteps}>
                    {unit === 'steps'
                      ? `${record.steps.toLocaleString()} steps`
                      : `${convertToKm(record.steps)} km`}
                  </Text>
                </View>
                <View style={styles.recordRight}>
                  <Text style={[
                    styles.percentage,
                    isComplete && styles.percentageComplete
                  ]}>
                    {percentage}%
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isComplete ? '#4ade80' : '#fff',
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        dailyGoal={dailyGoal}
        onGoalChange={setDailyGoal}
        unit={unit}
        onUnitChange={setUnit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 72,
    paddingBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Archivo_700Bold',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 128,
  },
  recordCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  recordContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDate: {
    color: '#fff',
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  recordSteps: {
    color: '#999',
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
  },
  recordRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  percentage: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_600SemiBold',
    color: '#999',
  },
  percentageComplete: {
    color: '#4ade80',
  },
  progressBarContainer: {
    width: 96,
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});
