import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { TreePine, X } from 'lucide-react-native';

interface WalkCompletionModalProps {
  steps: number;
  goal: number;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function WalkCompletionModal({ steps, goal, onClose, theme = 'bw' }: WalkCompletionModalProps) {
  const [showProgress, setShowProgress] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stat1Anim = useRef(new Animated.Value(0)).current;
  const stat2Anim = useRef(new Animated.Value(0)).current;
  const stat3Anim = useRef(new Animated.Value(0)).current;

  // Calculate stats
  const distanceKm = (steps * 0.762) / 1000; // Average step length
  const caloriesBurned = Math.round(steps * 0.04);
  const co2SavedKg = (distanceKm * 0.12).toFixed(2); // ~120g CO2/km if driving
  const treesSaved = Math.round(parseFloat(co2SavedKg) / 0.021); // One tree absorbs ~21kg CO2/year

  // Distance comparisons
  const getDistanceComparison = () => {
    const comparisons = [
      { name: 'Central Park', km: 9.5 },
      { name: 'the Eiffel Tower height', km: 0.324 },
      { name: 'Brooklyn Bridge', km: 1.8 },
      { name: 'Golden Gate Bridge', km: 2.7 },
      { name: 'Times Square to Empire State', km: 1.3 },
      { name: 'the Statue of Liberty height', km: 0.093 },
    ];

    const suitable = comparisons.filter(c => distanceKm >= c.km * 0.5);
    if (suitable.length === 0) return comparisons[comparisons.length - 1];
    
    const closest = suitable.reduce((prev, curr) => 
      Math.abs(curr.km - distanceKm) < Math.abs(prev.km - distanceKm) ? curr : prev
    );
    
    const ratio = (distanceKm / closest.km).toFixed(1);
    return { ...closest, ratio: parseFloat(ratio) };
  };

  const comparison = getDistanceComparison();

  const handleDissolveComplete = () => {
    setShowProgress(false);
    setShowStats(true);
  };

  // Simulate dissolve effect
  useEffect(() => {
    if (showProgress) {
      const timer = setTimeout(() => {
        handleDissolveComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showProgress]);

  // Sequential reveal of stats
  useEffect(() => {
    if (!showStats) return;
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timers = [
      setTimeout(() => {
        setCurrentStat(1);
        Animated.timing(stat1Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 100),
      setTimeout(() => {
        setCurrentStat(2);
        Animated.timing(stat2Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 600),
      setTimeout(() => {
        setCurrentStat(3);
        Animated.timing(stat3Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 1100),
    ];

    return () => timers.forEach(clearTimeout);
  }, [showStats]);

  const accentColor = theme === 'bo' ? '#ff4400' : '#fff';

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
        >
          <X size={32} color={accentColor} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Dissolving circular progress - simplified */}
          {showProgress && (
            <View style={styles.progressContainer}>
              <Text style={[styles.progressText, { color: accentColor }]}>
                {steps.toLocaleString('de-DE')}
              </Text>
              <Text style={styles.progressLabel}>steps completed</Text>
            </View>
          )}

          {/* Text reveals */}
          {showStats && (
            <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
              {/* Main number */}
              {currentStat >= 1 && (
                <Animated.View style={[styles.mainStat, { opacity: stat1Anim }]}>
                  <Text style={styles.mainNumber}>{steps.toLocaleString('de-DE')}</Text>
                  <Text style={styles.mainLabel}>STEPS</Text>
                </Animated.View>
              )}

              {/* Distance comparison */}
              {currentStat >= 2 && (
                <Animated.View style={[styles.statRow, { opacity: stat2Anim }]}>
                  <Text style={styles.statEmoji}>☉</Text>
                  <Text style={styles.statText}>
                    {`Today you walked ${
                      comparison.ratio === 1 
                        ? `the length of ${comparison.name}`
                        : comparison.ratio > 1
                        ? `${comparison.ratio}x ${comparison.name}`
                        : `${(comparison.ratio * 100).toFixed(0)}% of ${comparison.name}`
                    }`}
                  </Text>
                </Animated.View>
              )}

              {/* Environmental impact */}
              {currentStat >= 3 && (
                <Animated.View style={[styles.statRow, { opacity: stat3Anim }]}>
                  <TreePine size={20} color="#4ade80" strokeWidth={1.5} />
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statText}>
                      You saved {co2SavedKg} kg CO₂
                    </Text>
                    <Text style={styles.statSubtext}>
                      Equal to {treesSaved} tree{treesSaved !== 1 ? 's' : ''} working for a day
                    </Text>
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 20,
  },
  content: {
    width: '100%',
    maxWidth: 393,
    alignItems: 'center',
    padding: 48,
  },
  progressContainer: {
    alignItems: 'center',
    gap: 12,
  },
  progressText: {
    fontSize: 60,
    fontFamily: 'Archivo_400Regular',
    fontWeight: '200',
  },
  progressLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'JetBrainsMono_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsContainer: {
    width: '100%',
    gap: 32,
  },
  mainStat: {
    alignItems: 'center',
  },
  mainNumber: {
    fontSize: 60,
    color: '#fff',
    fontFamily: 'Archivo_400Regular',
    fontWeight: '200',
  },
  mainLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'JetBrainsMono_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
  },
  statEmoji: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  statText: {
    flex: 1,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'JetBrainsMono_400Regular',
    lineHeight: 26,
  },
  statTextContainer: {
    flex: 1,
    gap: 4,
  },
  statSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'JetBrainsMono_400Regular',
  },
});
