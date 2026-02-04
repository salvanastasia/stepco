import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, PanResponder, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

interface StepRecord {
  date: string;
  steps: number;
}

interface ActivityDetailModalProps {
  activity: StepRecord;
  goal: number;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function ActivityDetailModal({ activity, goal, onClose, theme = 'bw' }: ActivityDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSteps = (steps: number) => {
    return steps.toLocaleString('en-US').replace(/,/g, '.');
  };

  const percentage = Math.round((activity.steps / goal) * 100);
  const isComplete = activity.steps >= goal;

  // Calculate stats
  const distanceKm = (activity.steps * 0.762 / 1000).toFixed(2);
  const calories = Math.round(activity.steps * 0.04);
  const durationMinutes = Math.round(activity.steps / 100);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  // Pan responder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -100 && !isExpanded) {
          // Swipe up to expand
          setIsExpanded(true);
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dy > 100 && isExpanded) {
          // Swipe down when expanded to collapse
          setIsExpanded(false);
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dy > 150 && !isExpanded) {
          // Swipe down when collapsed to close
          Animated.timing(translateY, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          // Spring back
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modal,
            isExpanded ? styles.modalExpanded : styles.modalCollapsed,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={isExpanded ? styles.modalInner : styles.modalInnerCollapsed}>
            {/* Drag Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header with title and close button */}
            <View style={styles.header}>
              <Text style={styles.title}>Activity Details</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="rgba(255, 255, 255, 0.6)" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              scrollEnabled={isExpanded}
              showsVerticalScrollIndicator={false}
            >
              {/* Date */}
              <Text style={styles.date}>{formatDate(activity.date)}</Text>

              {/* Main Stats Card */}
              <View style={styles.card}>
                <View style={styles.cardBorder} />
                <View style={styles.cardContent}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Steps</Text>
                    <Text style={[styles.statValue, { color: accentColor }]}>
                      {formatSteps(activity.steps)}
                    </Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Goal Progress</Text>
                    <Text
                      style={[
                        styles.statValue,
                        { color: isComplete ? '#4ade80' : '#999999' },
                      ]}
                    >
                      {percentage}%
                    </Text>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isComplete ? '#4ade80' : accentColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Additional Stats */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.cardBorder} />
                  <View style={styles.statCardContent}>
                    <Text style={styles.statCardLabel}>Distance</Text>
                    <Text style={styles.statCardValue}>{distanceKm} km</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.cardBorder} />
                  <View style={styles.statCardContent}>
                    <Text style={styles.statCardLabel}>Calories</Text>
                    <Text style={styles.statCardValue}>{calories}</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.cardBorder} />
                  <View style={styles.statCardContent}>
                    <Text style={styles.statCardLabel}>Duration</Text>
                    <Text style={styles.statCardValue}>
                      {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                    </Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.cardBorder} />
                  <View style={styles.statCardContent}>
                    <Text style={styles.statCardLabel}>Avg Pace</Text>
                    <Text style={styles.statCardValue}>
                      {(durationMinutes / parseFloat(distanceKm)).toFixed(1)} min/km
                    </Text>
                  </View>
                </View>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
                  {isComplete && (
                    <View style={styles.achievementCard}>
                      <View style={styles.cardBorder} />
                      <View style={styles.achievementContent}>
                        <Text style={styles.achievementEmoji}>🎯</Text>
                        <View style={styles.achievementText}>
                          <Text style={styles.achievementTitle}>Goal Reached!</Text>
                          <Text style={styles.achievementDesc}>
                            You completed your daily goal
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modal: {
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalExpanded: {
    height: '85%',
  },
  modalCollapsed: {
    // Auto height based on content
  },
  modalInner: {
    flex: 1,
  },
  modalInnerCollapsed: {
    // No flex, let content define height
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: 28,
    includeFontPadding: false,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  date: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 24,
    marginBottom: 24,
    includeFontPadding: false,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 16,
    position: 'relative',
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  cardContent: {
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'JetBrainsMono_600SemiBold',
    includeFontPadding: false,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#0a0a0a',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    width: '48%',
    position: 'relative',
  },
  statCardContent: {
    padding: 16,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'DMMono_400Regular',
    marginBottom: 8,
    includeFontPadding: false,
  },
  statCardValue: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'JetBrainsMono_600SemiBold',
    includeFontPadding: false,
  },
  expandedContent: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'DMMono_400Regular',
    marginBottom: 12,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  achievementCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    position: 'relative',
  },
  achievementContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'JetBrainsMono_600SemiBold',
    marginBottom: 4,
    includeFontPadding: false,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
});
