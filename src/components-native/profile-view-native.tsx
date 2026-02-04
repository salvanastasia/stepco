import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import ActivityDetailModal from './activity-detail-modal-native';
import ProfileModal from './profile-modal-native';

interface StepRecord {
  date: string;
  steps: number;
}

interface ProfileViewProps {
  walkHistory: StepRecord[];
  goal: number;
  onGoalChange: (goal: number) => void;
  theme?: 'bw' | 'bo';
  onThemeChange?: (theme: 'bw' | 'bo') => void;
}

export default function ProfileView({
  walkHistory,
  goal,
  onGoalChange,
  theme = 'bw',
  onThemeChange,
}: ProfileViewProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<StepRecord | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatSteps = (steps: number) => {
    return steps.toLocaleString('en-US').replace(/,/g, '.');
  };

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity
          onPress={() => setShowProfileModal(true)}
          style={styles.settingsButton}
        >
          <Settings
            size={24}
            color={accentColor}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      </View>

      {/* History List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {walkHistory.map((record, index) => {
          const percentage = Math.round((record.steps / goal) * 100);
          const isComplete = record.steps >= goal;

          return (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => setSelectedActivity(record)}
            >
              <View style={styles.cardBorder} />
              <View style={styles.cardContent}>
                <View style={styles.leftContent}>
                  <Text style={styles.dateText}>{formatDate(record.date)}</Text>
                  <Text style={styles.stepsText}>{formatSteps(record.steps)} steps</Text>
                </View>

                <View style={styles.rightContent}>
                  <Text
                    style={[
                      styles.percentageText,
                      { color: isComplete ? '#4ade80' : '#999999' },
                    ]}
                  >
                    {percentage}%
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isComplete ? '#4ade80' : accentColor,
                          borderRadius: percentage < 100 ? 0 : 8,
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Profile Modal */}
      {showProfileModal && onThemeChange && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          initialGoal={goal}
          onGoalChange={onGoalChange}
          theme={theme}
          onThemeChange={onThemeChange}
        />
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          goal={goal}
          onClose={() => setSelectedActivity(null)}
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: 32,
    includeFontPadding: false,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  profileBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(136, 136, 136, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 128,
    gap: 8,
  },
  card: {
    backgroundColor: '#2a2a2a',
    height: 73.207,
    borderRadius: 10,
    position: 'relative',
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 0.615,
    borderColor: '#3a3a3a',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16.61,
    paddingHorizontal: 16.61,
  },
  leftContent: {
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 20,
    includeFontPadding: false,
  },
  stepsText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 16,
    includeFontPadding: false,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 20,
    includeFontPadding: false,
  },
  progressBarContainer: {
    width: 96,
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
  },
});
