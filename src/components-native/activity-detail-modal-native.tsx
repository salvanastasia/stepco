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
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;

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

  // Sequential entry animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(modalTranslateY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              opacity: overlayOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.modal,
            isExpanded ? styles.modalExpanded : styles.modalCollapsed,
            {
              transform: [
                { translateY: Animated.add(translateY, modalTranslateY) },
              ],
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

            {!isExpanded ? (
              /* Collapsed Preview */
              <View style={styles.collapsedPreview}>
                <Text style={styles.date}>{formatDate(activity.date)}</Text>
                
                <View style={styles.collapsedStats}>
                  <View style={styles.collapsedMainStat}>
                    <Text style={styles.collapsedStepsValue}>{formatSteps(activity.steps)}</Text>
                    <Text style={styles.collapsedStepsLabel}>steps</Text>
                  </View>
                  
                  <View style={styles.collapsedSecondaryStats}>
                    <View style={styles.collapsedSecondaryStat}>
                      <Text style={styles.collapsedSecondaryValue}>{distanceKm} km</Text>
                      <Text style={styles.collapsedSecondaryLabel}>distance</Text>
                    </View>
                    <View style={styles.collapsedSecondaryStat}>
                      <Text style={styles.collapsedSecondaryValue}>{calories} kcal</Text>
                      <Text style={styles.collapsedSecondaryLabel}>calories</Text>
                    </View>
                    <View style={styles.collapsedSecondaryStat}>
                      <Text style={styles.collapsedSecondaryValue}>
                        {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}min`}
                      </Text>
                      <Text style={styles.collapsedSecondaryLabel}>duration</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {/* Date */}
                <Text style={styles.date}>{formatDate(activity.date)}</Text>

                {/* Map Section - Only visible when expanded */}
                <View style={styles.mapSection}>
                  <View style={styles.mapCard}>
                    <View style={styles.mapCardBorder} />
                    <View style={styles.mapContainer}>
                      <View style={styles.mapPlaceholder}>
                        <Text style={styles.mapPlaceholderText}>Walk Route Map</Text>
                        <Text style={styles.mapPlaceholderSubtext}>
                          {distanceKm} km • {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}min`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Main Stats Card */}
              <View style={styles.mainCard}>
                {/* Steps */}
                <View style={styles.stepsSection}>
                  <Text style={styles.stepsLabel}>STEPS</Text>
                  <Text style={styles.stepsValue}>{formatSteps(activity.steps)}</Text>
                  <Text style={styles.stepsUnit}>steps</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Goal Progress</Text>
                    <Text
                      style={[
                        styles.progressPercentage,
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
                          backgroundColor: isComplete ? '#4ade80' : (theme === 'bo' ? '#ff4400' : '#ffffff'),
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Additional Stats Grid (3 columns) */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>DISTANCE</Text>
                  <Text style={styles.statCardValue}>{distanceKm}</Text>
                  <Text style={styles.statCardUnit}>km</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>CALORIES</Text>
                  <Text style={styles.statCardValue}>{calories}</Text>
                  <Text style={styles.statCardUnit}>kcal</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>DURATION</Text>
                  <Text style={styles.statCardValue}>
                    {hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : minutes}
                  </Text>
                  <Text style={styles.statCardUnit}>{hours > 0 ? 'hours' : 'min'}</Text>
                </View>
              </View>
              </ScrollView>
            )}
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
    fontFamily: 'System',
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
  collapsedPreview: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  collapsedStats: {
    gap: 16,
  },
  collapsedMainStat: {
    alignItems: 'center',
    gap: 4,
  },
  collapsedStepsValue: {
    fontSize: 48,
    fontFamily: 'Archivo_400Regular',
    color: '#ffffff',
    lineHeight: 48,
    includeFontPadding: false,
  },
  collapsedStepsLabel: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#999999',
    lineHeight: 21,
    includeFontPadding: false,
  },
  collapsedSecondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  collapsedSecondaryStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  collapsedSecondaryValue: {
    fontSize: 16,
    fontFamily: 'JetBrainsMono_500Medium',
    color: '#ffffff',
    lineHeight: 24,
    includeFontPadding: false,
  },
  collapsedSecondaryLabel: {
    fontSize: 10,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#999999',
    lineHeight: 15,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  date: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 24,
    marginBottom: 24,
    includeFontPadding: false,
  },
  mainCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  stepsSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 18,
    marginBottom: 8,
    includeFontPadding: false,
  },
  stepsValue: {
    fontSize: 48,
    color: '#ffffff',
    fontFamily: 'Archivo_400Regular',
    fontWeight: '300',
    lineHeight: 48,
    includeFontPadding: false,
  },
  stepsUnit: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 21,
    marginTop: 8,
    includeFontPadding: false,
  },
  progressSection: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 18,
    includeFontPadding: false,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 21,
    includeFontPadding: false,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  statCardLabel: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 15,
    marginBottom: 8,
    includeFontPadding: false,
  },
  statCardValue: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Archivo_400Regular',
    fontWeight: '300',
    lineHeight: 20,
    marginBottom: 4,
    includeFontPadding: false,
  },
  statCardUnit: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 15,
    includeFontPadding: false,
  },
  mapSection: {
    marginBottom: 24,
  },
  mapCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 0.615,
    borderColor: '#3a3a3a',
    pointerEvents: 'none',
  },
  mapContainer: {
    padding: 16,
  },
  mapPlaceholder: {
    height: 201,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'JetBrainsMono_400Regular',
    marginBottom: 8,
    includeFontPadding: false,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'JetBrainsMono_400Regular',
    includeFontPadding: false,
  },
});
