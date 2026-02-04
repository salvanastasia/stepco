import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
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
  profileImage?: string | null;
  onProfileImageChange?: (image: string) => void;
}

type ViewType = 'week' | 'year';

export default function ProfileView({
  walkHistory,
  goal,
  onGoalChange,
  theme = 'bw',
  onThemeChange,
  profileImage,
  onProfileImageChange,
}: ProfileViewProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<StepRecord | null>(null);
  const [viewType, setViewType] = useState<ViewType>('week');
  const sliderPosition = useRef(new Animated.Value(0)).current;

  // Animate slider when view type changes
  useEffect(() => {
    Animated.spring(sliderPosition, {
      toValue: viewType === 'week' ? 0 : 168,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [viewType]);

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

  // Generate year view data (Jan 1 - Dec 31 of current year)
  const generateYearData = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const todayStr = today.toISOString().split('T')[0];
    const yearData = [];
    
    // Start from January 1st of current year
    const startDate = new Date(currentYear, 0, 1); // Month is 0-indexed
    
    // Calculate days in current year (365 or 366 for leap year)
    const endDate = new Date(currentYear, 11, 31);
    const daysInYear = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 0; i < daysInYear; i++) {
      const date = new Date(currentYear, 0, 1 + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find matching record in walkHistory
      const record = walkHistory.find(r => r.date === dateStr);
      const steps = record ? record.steps : 0;
      const isToday = dateStr === todayStr;
      
      yearData.push({ date: dateStr, steps, isToday });
    }
    
    return yearData;
  };

  const yearData = generateYearData();

  // Calculate dot opacity based on steps
  const getDotStyle = (steps: number, isToday: boolean) => {
    if (isToday) {
      // Always use orange for current day
      return { backgroundColor: '#ff4400', opacity: 1 };
    }
    
    if (steps === 0) {
      return { backgroundColor: '#ffffff', opacity: 0.1 };
    }
    
    const percentage = Math.min(steps / goal, 1.5);
    const opacity = 0.3 + (percentage * 0.7); // Range from 0.3 to 1.0
    
    return { backgroundColor: '#ffffff', opacity: Math.min(opacity, 1) };
  };

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

      {/* View Switcher */}
      <View style={styles.switcherContainer}>
        <View style={styles.switcherBackground}>
          <Animated.View
            style={[
              styles.sliderBackground,
              {
                transform: [{ translateX: sliderPosition }],
              },
            ]}
          />
          <TouchableOpacity
            style={styles.switcherButton}
            onPress={() => setViewType('week')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switcherText, viewType === 'week' && styles.switcherTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switcherButton}
            onPress={() => setViewType('year')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switcherText, viewType === 'year' && styles.switcherTextActive]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Week View - History List */}
      {viewType === 'week' && (
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
      )}

      {/* Year View - Dot Grid */}
      {viewType === 'year' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.yearScrollContent}
        >
          <View style={styles.dotGrid}>
            {yearData.map((day, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  getDotStyle(day.steps, day.isToday),
                ]}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Profile Modal */}
      {showProfileModal && onThemeChange && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          initialGoal={goal}
          onGoalChange={onGoalChange}
          theme={theme}
          onThemeChange={onThemeChange}
          profileImage={profileImage}
          onProfileImageChange={onProfileImageChange}
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
  settingsButton: {
    padding: 8,
  },
  switcherContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  switcherBackground: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 4,
    position: 'relative',
    height: 40,
  },
  sliderBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 168,
    height: 32,
    backgroundColor: '#3a3a3a',
    borderRadius: 6,
  },
  switcherButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  switcherText: {
    fontSize: 13,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#999999',
    lineHeight: 18,
    includeFontPadding: false,
  },
  switcherTextActive: {
    color: '#ffffff',
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
  yearScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 128,
    alignItems: 'center',
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 268,
    gap: 12,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
